import { Router } from "express";
import {
  startExam,
  saveAnswer,
  submitExam,
} from "../controllers/attemptController";
import auth from "../middleware/auth.middleware";

const router = Router();

router.post("/start", auth.authenticate, startExam);
router.post("/save-answer", auth.authenticate, saveAnswer);
router.post("/submit", auth.authenticate, submitExam);

export default router;
