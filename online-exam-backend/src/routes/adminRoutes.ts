import { Router } from "express";
import {
  deleteStudent,
  getAllStudents,
  getStudentById,
} from "../controllers/AdminController";
import auth from "../middleware/auth.middleware";

const router = Router();

router.get("/", auth.authenticate, auth.adminMiddleware, getAllStudents);
router.get("/:id", auth.authenticate, auth.adminMiddleware, getStudentById);
router.delete("/:id", auth.authenticate, auth.adminMiddleware, deleteStudent);

export default router;
