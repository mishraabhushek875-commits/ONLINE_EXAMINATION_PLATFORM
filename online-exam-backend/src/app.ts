import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import questionRoutes from "./routes/questionsRoute";
import examRoutes from "./routes/examRoutes";
import assignmentRoutes from "./routes/assignedRoutes";
import bankRoutes from "./routes/bankController";
import adminRoutes from "./routes/adminRoutes";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`🔥 ${req.method} ${req.url}`);
  next();
});

// Base Route (Check karne ke liye ki API chal rahi hai)
app.get("/", (req, res) => {
  res.send("🚀 Online Examination Management System API is running...");
});

// App Routes attach kar rahe hain
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/banks", bankRoutes);

// existing routes ke neeche
app.use("/api/exams", examRoutes);
app.use("/api/admin/exams", assignmentRoutes);
app.use("/api/admin/students", adminRoutes);

// Agar koi galat route hit kare toh handle karne ke liye fallback catch
app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
  });
});

export default app;
