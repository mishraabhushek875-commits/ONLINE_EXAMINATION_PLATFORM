import { Router } from "express";
import {
  createQuestion,
  deleteQuestion,
  getQuestion,
  getQuestions,
} from "../controllers/questionsController";

const router = Router();

router.post("/", createQuestion);
router.get("/", getQuestions);
router.delete("/:id", deleteQuestion);
router.get("/:id", getQuestion);

export default router;
