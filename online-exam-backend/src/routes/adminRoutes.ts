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

// ⚠️ IMPORTANT: specific/static routes MUST come before "/:id".
// Express matches top-to-bottom — "/:id" would otherwise swallow
// "/results", "/dashboard/stats" etc. (treating "results" as an id).

// GET /api/admin/students/dashboard/stats
router.get(
  "/dashboard/stats",
  auth.authenticate,
  auth.adminMiddleware,
  getDashboardStats,
);

// GET /api/admin/students/results
router.get("/results", auth.authenticate, auth.adminMiddleware, getAllResults);

// GET /api/admin/students/results/:attemptId
router.get(
  "/results/:attemptId",
  auth.authenticate,
  auth.adminMiddleware,
  getResultDetailAdmin,
);

// GET /api/admin/students/exams/:examId/results
router.get(
  "/exams/:examId/results",
  auth.authenticate,
  auth.adminMiddleware,
  getExamResults,
);

// GET /api/admin/students/student/:studentId/results
router.get(
  "/student/:studentId/results",
  auth.authenticate,
  auth.adminMiddleware,
  getStudentResultsAdmin,
);

// ── Student CRUD (generic "/:id" — must stay LAST) ──
router.get("/", auth.authenticate, auth.adminMiddleware, getAllStudents);
router.get("/:id", auth.authenticate, auth.adminMiddleware, getStudentById);
router.delete("/:id", auth.authenticate, auth.adminMiddleware, deleteStudent);

export default router;
