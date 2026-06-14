import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { generateOTP, saveOTP, verifyOTP } from "../utils/otpService";
import { sendOtpEmail } from "../utils/emailService";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_fallback";

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    console.log("✅ Register function hit hua!"); // ← sabse pehle
    console.log("Body:", req.body);
    try {
      const { full_name, email, phone, password, role } = req.body;

      if (!full_name || !email || !password || !phone) {
        res.status(400).json({ message: "All fields required!!" });
        return;
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({
          message: "This user is already registered. Try with another email!",
        });
        return;
      }

      await prisma.user.create({
        data: {
          full_name,
          email,
          phone,
          password,
          role: role || "student",
        },
      });

      const otp = generateOTP();
      await saveOTP(email, otp);
      await sendOtpEmail(email, otp);
      res.status(200).json({ message: "OTP sent!" });
      return;
    } catch (error: any) {
      console.error("Register Error:", JSON.stringify(error, null, 2));
      console.error("Register Error Message:", error?.message);
      console.error("Register Error Stack:", error?.stack);
      res.status(500).json({
        message: "Internal Server Error",
        error: error?.message,
        stack: error?.stack,
      });
      return;
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email aur password dono chahiye!" });
        return;
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(401).json({ message: "Invalid credentials!" });
        return;
      }

      if (user.status === "inactive") {
        res.status(403).json({ message: "Account is inactive!" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Input password:", password);
      console.log("DB password hash:", user.password);
      console.log("isMatch:", isMatch);
      if (!isMatch) {
        res.status(401).json({ message: "Invalid credentials!" });
        return;
      }

      const otp = await generateOTP();
      await saveOTP(email, otp);
      await sendOtpEmail(email, otp);
      res.status(200).json({ message: "Verify otp is sent on you email" });
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal Server Error",
        error: error?.message,
        stack: error?.stack,
      });
      return;
    }
  },

  async verifyOtp(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body;

    try {
      if (!email || !otp) {
        res.status(400).json({ message: "Email and otp required" });
        return;
      }

      const isValid = await verifyOTP(email, Number(otp));
      if (!isValid) {
        res.status(400).json({ message: "Invalid or expired otp" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        res.status(400).json({ message: "User not found" });
      }

      const accessToken = jwt.sign(
        { id: user?.id, role: user?.role },
        JWT_SECRET,
        { expiresIn: "15m" },
      );

      const refreshToken = jwt.sign(
        { id: user?.id, role: user?.role },
        REFRESH_SECRET,
        { expiresIn: "7d" },
      );

      const person = await prisma.user.update({
        where: { email },
        data: { refreshToken },
        select: {
          full_name: true,
          email: true,
          refreshToken: true,
        },
      });
      res.status(200).json({
        message: "User Loggined successfully",
        data: accessToken,
        person: person,
      });
    } catch (error) {
      console.error("VerifyOtp Error:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: String(error) });
    }
  },

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ message: "RefreshToken required" });
        return;
      }
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
        id: number;
      };

      const accessToken = jwt.sign({ id: decoded.id }, REFRESH_SECRET, {
        expiresIn: "15m",
      });
      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired refresh token!" });
    }
  },

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { email, otp, newPassword } = req.body;
    try {
      if (!email || !otp) {
        res.status(400).json({ message: "OTP required" });
        return;
      }
      const exists = await prisma.otp.findFirst({
        where: {
          email,
          otp: Number(otp),
        },
      });
      if (!exists) {
        res.status(400).json({ message: "No Otp found" });
        return;
      }
      const isValid = await verifyOTP(email, Number(otp));
      if (!isValid) {
        res.status(400).json({ message: "Invalid or expired otp" });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updated = await prisma.user.update({
        where: {
          email,
        },
        data: { password: hashedPassword },
      });
      console.log("Updated password hash:", updated.password);
      res
        .status(200)
        .json({ message: "Password reset successfully", user: updated });
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal Server Error",
        error: error?.message,
        stack: error?.stack,
      });
      return;
    }
  },

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    try {
      if (!email) {
        res.status(400).json({ message: "Email required" });
        return;
      }
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }
      const otp = generateOTP();
      await saveOTP(email, otp);
      await sendOtpEmail(email, otp);

      res.status(200).json({ message: "password reset otp sent successfully" });
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal Server Error",
        error: error?.message,
        stack: error?.stack,
      });
      return;
    }
  },
};
