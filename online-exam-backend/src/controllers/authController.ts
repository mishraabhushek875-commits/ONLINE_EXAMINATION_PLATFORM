import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const authController = {
    // REGISTER API LOGIC [cite: 16]
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { full_name, email, phone, password, role } = req.body;

            // Simple validation [cite: 112]
            if (!full_name || !email || !password || !phone) {
                res.status(400).json({ message: "Bhai, full_name, email, phone aur password sab zaroori hain!" });
                return;
            }

            // Check if user already exists
            const existingUser = await UserModel.findUserByEmail(email);
            if (existingUser) {
                res.status(400).json({ message: "Yeh email pehle se registered hai!" });
                return;
            }


            // Password hashing for security [cite: 112]
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);



            // Database insertion [cite: 31]
            const newUser = await UserModel.createUser({
                full_name,
                email,
                phone,
                password: hashedPassword,
                role
            });



            res.status(201).json({
                message: "User successfully registered! 🎉",
                user: newUser
            });
        } catch (error) {
            console.error("Register Error:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    // LOGIN API LOGIC [cite: 17]
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ message: "Email aur password dono chahiye!" });
                return;
            }

            // Find user
            const user = await UserModel.findUserByEmail(email);
            if (!user) {
                res.status(401).json({ message: "Invalid email ya password!" });
                return;
            }
            

            // Check if user is blocked [cite: 41]
            if (user.status === 'inactive') {
                res.status(403).json({ message: "Aapka account inactive hai!" });
                return;
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password || '');
            if (!isMatch) {
                res.status(401).json({ message: "Invalid email ya password!" });
                return;
            }

            // Generate JWT Token [cite: 20]
            const token = jwt.sign(
                { id: user.id, role: user.role },
                JWT_SECRET,
                { expiresIn: '1d' }
            );

            // Sensitive field remove karo response se pehle [cite: 112]
            delete user.password;

            res.status(200).json({
                message: "Login successful! 🚀",
                token,
                user
            });
        } catch (error) {
            console.error("Login Error:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};