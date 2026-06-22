import { Router } from "express";
import {
  assignExamToStudent,
  bulkAssignExam,
  getAssignedStudents,
  getStudentAssignedExams,
  removeAssignment,
} from "../controllers/assignmentController";
import auth from "../middleware/auth.middleware";

const router = Router();

// All Admin only
router.post(
  "/:examId/assign",
  auth.authenticate,
  auth.adminMiddleware,
  assignExamToStudent,
);
router.post(
  "/:examId/assign/bulk",
  auth.authenticate,
  auth.adminMiddleware,
  bulkAssignExam,
);
router.get(
  "/:examId/assigned-students",
  auth.authenticate,
  auth.adminMiddleware,
  getAssignedStudents,
);
router.get(
  "/student/:studentId/assigned-exams",
  auth.authenticate,
  auth.adminMiddleware,
  getStudentAssignedExams,
);
router.delete(
  "/:examId/assign/:studentId",
  auth.authenticate,
  auth.adminMiddleware,
  removeAssignment,
);

export default router;
