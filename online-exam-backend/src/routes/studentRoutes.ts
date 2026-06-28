import { Router } from "express";
import auth from "../middleware/auth.middleware";
import { getStudentDashboard } from "../controllers/studentController";
import {
  getMyResults,
  getMyResultDetail,
} from "../controllers/resultController";

const router = Router();

// GET /api/student/dashboard
router.get("/dashboard", auth.authenticate, getStudentDashboard);

// GET /api/student/results
router.get("/results", auth.authenticate, getMyResults);

// GET /api/student/results/:attemptId
router.get("/results/:attemptId", auth.authenticate, getMyResultDetail);

export default router;
