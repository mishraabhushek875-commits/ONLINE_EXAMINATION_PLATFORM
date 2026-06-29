// src/routes/student/result.routes.ts
import { Router } from "express";
import auth from "../middleware/auth.middleware";
import {
  getMyResults,
  getMyResultDetail,
} from "../controllers/resultController";

const router = Router();

// GET /api/student/results
router.get("/", auth.authenticate, getMyResults);

// GET /api/student/results/:attemptId
router.get("/:attemptId", auth.authenticate, getMyResultDetail);

export default router;
