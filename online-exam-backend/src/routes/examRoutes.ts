import {
  createExam,
  deleteExam,
  getAllExams,
  getExamById,
  updateExam,
} from "../controllers/examController";
import { getMyAssignedExams } from "../controllers/assignmentController"; // import add
import auth from "../middleware/auth.middleware";
import { Router } from "express";

const router = Router();

// Student route — sirf authenticate, admin nahi chahiye
router.get("/assigned/me", auth.authenticate, getMyAssignedExams); // yeh add karo

// Existing Admin only routes
router.post("/", auth.authenticate, auth.adminMiddleware, createExam);
router.get("/", auth.authenticate, auth.adminMiddleware, getAllExams);
router.get("/:id", auth.authenticate, auth.adminMiddleware, getExamById);
router.patch("/:id", auth.authenticate, auth.adminMiddleware, updateExam);
router.delete("/:id", auth.authenticate, auth.adminMiddleware, deleteExam);

export default router;
