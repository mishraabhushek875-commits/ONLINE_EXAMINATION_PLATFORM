import { Router } from "express";
import {
  createQuestion,
  deleteQuestion,
  getQuestion,
  getQuestions,
} from "../controllers/questionsController";
import auth from "../middleware/auth.middleware";

const router = Router();

// 🔴 Admin only — sirf admin kar sakta hai
router.post("/", auth.authenticate, auth.adminMiddleware, createQuestion);
router.delete("/:id", auth.authenticate, auth.adminMiddleware, deleteQuestion);

// 🟢 Authenticated users — admin + student dono
router.get("/", auth.authenticate, getQuestions);
router.get("/:id", auth.authenticate, getQuestion);

export default router;