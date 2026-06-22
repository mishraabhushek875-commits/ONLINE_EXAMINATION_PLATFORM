import { Router } from "express";
import {
  createExam,
  deleteExam,
  getAllExams,
  getExamById,
  updateExam,
} from "../controllers/examController";
import auth from "../middleware/auth.middleware";

const router = Router();

// All Admin only
router.post("/", auth.authenticate, auth.adminMiddleware, createExam);
router.get("/", auth.authenticate, auth.adminMiddleware, getAllExams);
router.get("/:id", auth.authenticate, auth.adminMiddleware, getExamById);
router.patch("/:id", auth.authenticate, auth.adminMiddleware, updateExam);
router.delete("/:id", auth.authenticate, auth.adminMiddleware, deleteExam);

export default router;