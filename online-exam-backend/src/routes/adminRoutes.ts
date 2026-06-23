import { Router } from "express";
import {
  deleteStudent,
  getAllStudents,
  getStudentById,
} from "../controllers/adminController";
import auth from "../middleware/auth.middleware";
import {
  getAllResults,
  getDashboardStats,
  getExamResults,
  getResultDetailAdmin,
  getStudentResultsAdmin,
} from "../controllers/resultController";

const router = Router();

router.get("/", auth.authenticate, auth.adminMiddleware, getAllStudents);
router.get("/:id", auth.authenticate, auth.adminMiddleware, getStudentById);
router.delete("/:id", auth.authenticate, auth.adminMiddleware, deleteStudent);
router.get("/results", auth.authenticate, auth.adminMiddleware, getAllResults);

// GET /api/admin/results/:attemptId
router.get(
  "/results/:attemptId",
  auth.authenticate,
  auth.adminMiddleware,
  getResultDetailAdmin,
);

// GET /api/admin/exams/:examId/results
router.get(
  "/exams/:examId/results",
  auth.authenticate,
  auth.adminMiddleware,
  getExamResults,
);

// GET /api/admin/student/:studentId/results
router.get(
  "/student/:studentId/results",
  auth.authenticate,
  auth.adminMiddleware,
  getStudentResultsAdmin,
);

// GET /api/admin/dashboard/stats
router.get(
  "/dashboard/stats",
  auth.authenticate,
  auth.adminMiddleware,
  getDashboardStats,
);

export default router;
