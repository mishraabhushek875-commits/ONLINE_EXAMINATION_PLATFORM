// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import questionRoutes from "./routes/questionsRoute";
import examRoutes from "./routes/examRoutes";
import assignmentRoutes from "./routes/assignedRoutes";
import bankRoutes from "./routes/bankRoutes";
import adminRoutes from "./routes/adminRoutes";
import resultRoutes from "./routes/resultRoutes";
import attemptRoutes from "./routes/attemptRoutes";
import studentRoutes from "./routes/studentRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`🔥 ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("🚀 Online Examination Management System API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/banks", bankRoutes);
app.use("/api/exams", examRoutes);

app.use("/api/admin/exams", assignmentRoutes);
app.use("/api/admin/students", adminRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/attempt", attemptRoutes);
app.use("/api/student", studentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

export default app;
