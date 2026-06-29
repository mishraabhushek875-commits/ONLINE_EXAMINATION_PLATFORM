import { Router } from "express";
import {
  createExam,
  deleteExam,
  getAllExams,
  getExamById,
  updateExam,
} from "../controllers/examController";
import auth from "../middleware/auth.middleware";

console.log("✅ examRoutes.ts loaded");

const router = Router();

// Test Route
router.get("/test", (req, res) => {
  console.log("✅ /api/exams/test hit");
  res.json({
    success: true,
    message: "Exam Routes Working",
  });
});

// Create Exam
router.post(
  "/",
  auth.authenticate,
  auth.adminMiddleware,
  (req, res, next) => {
    console.log("✅ POST /api/exams");
    next();
  },
  createExam
);

// Get All Exams
router.get(
  "/",
  (req, res, next) => {
    console.log("✅ GET /api/exams matched");
    next();
  },
  auth.authenticate,
  auth.adminMiddleware,
  getAllExams
);

// Get Exam By Id
router.get(
  "/:id",
  auth.authenticate,
  auth.adminMiddleware,
  getExamById
);

// Update Exam
router.patch(
  "/:id",
  auth.authenticate,
  auth.adminMiddleware,
  updateExam
);

// Delete Exam
router.delete(
  "/:id",
  auth.authenticate,
  auth.adminMiddleware,
  deleteExam
);

export default router;