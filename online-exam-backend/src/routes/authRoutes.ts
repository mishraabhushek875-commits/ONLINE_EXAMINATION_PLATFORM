import { Router } from "express";
import { authController } from "../controllers/authController";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOtp);
router.post("/refresh-token", authController.refreshToken);
router.post("/reset-password", authController.resetPassword);
router.post("/forgot-password", authController.forgotPassword);

export default router;
