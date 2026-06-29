import { Router } from "express";
import {
  createBank,
  deleteBank,
  getAllBanks,
  getBankFromId,
  updateBank,
} from "../controllers/bankController";
import auth from "../middleware/auth.middleware";

const router = Router();

// 🔴 Admin only
router.post("/", auth.authenticate, auth.adminMiddleware, createBank);
router.patch("/:id", auth.authenticate, auth.adminMiddleware, updateBank);
router.delete("/:id", auth.authenticate, auth.adminMiddleware, deleteBank);

// 🟢 Authenticated users
router.get("/", auth.authenticate, getAllBanks);
router.get("/:id", auth.authenticate, getBankFromId);

export default router;