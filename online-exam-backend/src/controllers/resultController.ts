// src/controllers/result.controller.ts
// Result module — saare 7 APIs (Student + Admin) — TypeScript version

import { Request, Response } from "express";
import {
  MyResultItem,
  QuestionReview,
  ResultDetail,
  AdminResultItem,
  ExamResultsSummary,
  DashboardStats,
  ResultsQuery,
} from "../results.types";
import prisma from "../config/db";
import { Prisma } from "@prisma/client";

// ════════════════════════════════════════════════════════════════════════
// 1. GET /api/student/results
//    Logged-in student ke saare submitted attempts ki list
// ════════════════════════════════════════════════════════════════════════
export const getMyResults = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const studentId = req.user!.id; // isAuth middleware ne set kiya hoga

    const attempts = await prisma.examAttempt.findMany({
      where: {
        studentId,
        status: "submitted",
      },
      include: {
        exam: {
          select: { title: true, totalMarks: true, passingMarks: true },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    const results: MyResultItem[] = attempts.map((a) => ({
      attempt_id: a.id,
      exam_title: a.exam.title,
      score: a.score ?? 0,
      total_marks: a.exam.totalMarks,
      passed: (a.score ?? 0) >= a.exam.passingMarks,
      submitted_at: a.submittedAt,
    }));

    res.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res
      .status(500)
      .json({ message: "Failed to fetch results", error: message });
  }
};

// ════════════════════════════════════════════════════════════════════════
// 2. GET /api/student/results/:attemptId
//    Ek attempt ka detailed result — question-wise review
//    (sirf apna result dekh sakta hai — studentId match zaroori)
// ════════════════════════════════════════════════════════════════════════
export const getMyResultDetail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const attemptId = Number(req.params.attemptId);
    const studentId = req.user!.id;

    const attempt = await prisma.examAttempt.findFirst({
      where: { id: attemptId, studentId }, // ownership check
      include: {
        exam: { select: { title: true, totalMarks: true, passingMarks: true } },
        studentAnswers: {
          include: {
            question: {
              include: { options: true, answer: true },
            },
            option: true,
          },
        },
      },
    });

    if (!attempt) {
      res.status(404).json({ message: "Result not found" });
      return;
    }

    const questions: QuestionReview[] = attempt.studentAnswers.map((sa) => {
      const correctOptionId = sa.question.answer[0]?.optionId;
      return {
        question_text: sa.question.text,
        options: sa.question.options.map((o) => ({ id: o.id, text: o.text })),
        selected_option_id: sa.optionId,
        correct_option_id: correctOptionId,
        is_correct: sa.optionId === correctOptionId,
      };
    });

    const result: ResultDetail = {
      attempt_id: attempt.id,
      exam_title: attempt.exam.title,
      score: attempt.score ?? 0,
      total_marks: attempt.exam.totalMarks,
      passed: (attempt.score ?? 0) >= attempt.exam.passingMarks,
      submitted_at: attempt.submittedAt,
      questions,
    };

    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res
      .status(500)
      .json({ message: "Failed to fetch result detail", error: message });
  }
};

// ════════════════════════════════════════════════════════════════════════
// 3. GET /api/admin/results
//    Saare students ke saare results — filterable
//    Query params: ?examId=&studentId=&passed=true&page=1&limit=10
// ════════════════════════════════════════════════════════════════════════
export const getAllResults = async (
  req: Request<{}, {}, {}, ResultsQuery>,
  res: Response,
): Promise<void> => {
  try {
    const { examId, studentId, passed, page = "1", limit = "10" } = req.query;

    // Prisma.ExamAttemptWhereInput use karo — manual type likhne se
    // TS findMany ka overload resolve nahi kar paata aur include ka effect
    // return type pe nahi padta (isi se "student does not exist" error aata hai)
    const where: Prisma.ExamAttemptWhereInput = {
      status: "submitted",
    };
    if (examId) where.examId = Number(examId);
    if (studentId) where.studentId = Number(studentId);

    const attempts = await prisma.examAttempt.findMany({
      where,
      include: {
        student: { select: { id: true, full_name: true, email: true } },
        exam: { select: { title: true, totalMarks: true, passingMarks: true } },
      },
      orderBy: { submittedAt: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    let results: AdminResultItem[] = attempts.map((a) => ({
      attempt_id: a.id,
      student: a.student.full_name,
      student_email: a.student.email,
      exam_title: a.exam.title,
      score: a.score ?? 0,
      total_marks: a.exam.totalMarks,
      passed: (a.score ?? 0) >= a.exam.passingMarks,
      submitted_at: a.submittedAt,
    }));

    // passed filter — computed field hai, DB query mein nahi laga sakte
    if (passed !== undefined) {
      const wantPassed = passed === "true";
      results = results.filter((r) => r.passed === wantPassed);
    }

    const total = await prisma.examAttempt.count({ where });

    res.json({ results, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res
      .status(500)
      .json({ message: "Failed to fetch results", error: message });
  }
};

// ════════════════════════════════════════════════════════════════════════
// 4. GET /api/admin/results/:attemptId
//    Ek attempt ka full detail — admin view (kisi bhi student ka)
// ════════════════════════════════════════════════════════════════════════
export const getResultDetailAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const attemptId = Number(req.params.attemptId);

    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        student: { select: { full_name: true, email: true } },
        exam: { select: { title: true, totalMarks: true, passingMarks: true } },
        studentAnswers: {
          include: {
            question: { include: { options: true, answer: true } },
            option: true,
          },
        },
      },
    });

    if (!attempt) {
      res.status(404).json({ message: "Attempt not found" });
      return;
    }

    const questions = attempt.studentAnswers.map((sa) => {
      const correctOptionId = sa.question.answer[0]?.optionId;
      return {
        question_text: sa.question.text,
        selected_option_id: sa.optionId,
        correct_option_id: correctOptionId,
        is_correct: sa.optionId === correctOptionId,
      };
    });

    res.json({
      attempt_id: attempt.id,
      student: attempt.student.full_name,
      student_email: attempt.student.email,
      exam_title: attempt.exam.title,
      score: attempt.score ?? 0,
      total_marks: attempt.exam.totalMarks,
      passed: (attempt.score ?? 0) >= attempt.exam.passingMarks,
      started_at: attempt.startedAt,
      submitted_at: attempt.submittedAt,
      questions,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res
      .status(500)
      .json({ message: "Failed to fetch attempt detail", error: message });
  }
};

// ════════════════════════════════════════════════════════════════════════
// 5. GET /api/admin/exams/:examId/results
//    Ek exam ke saare students ke results + summary stats
// ════════════════════════════════════════════════════════════════════════
export const getExamResults = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const examId = Number(req.params.examId);

    const exam = await prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) {
      res.status(404).json({ message: "Exam not found" });
      return;
    }

    const attempts = await prisma.examAttempt.findMany({
      where: { examId, status: "submitted" },
      include: { student: { select: { full_name: true, email: true } } },
      orderBy: { score: "desc" },
    });

    const passCount = attempts.filter(
      (a) => (a.score ?? 0) >= exam.passingMarks,
    ).length;
    const avgScore =
      attempts.length > 0
        ? attempts.reduce((sum, a) => sum + (a.score ?? 0), 0) / attempts.length
        : 0;

    const summary: ExamResultsSummary = {
      exam_title: exam.title,
      total_appeared: attempts.length,
      pass_count: passCount,
      fail_count: attempts.length - passCount,
      average_score: Math.round(avgScore),
      results: attempts.map((a) => ({
        attempt_id: a.id,
        student: a.student.full_name,
        score: a.score ?? 0,
        passed: (a.score ?? 0) >= exam.passingMarks,
      })),
    };

    res.json(summary);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res
      .status(500)
      .json({ message: "Failed to fetch exam results", error: message });
  }
};

// ════════════════════════════════════════════════════════════════════════
// 6. GET /api/admin/student/:studentId/results
//    Ek student ke saare exams ke results (history)
// ════════════════════════════════════════════════════════════════════════
export const getStudentResultsAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const studentId = Number(req.params.studentId);

    const student = await prisma.user.findUnique({ where: { id: studentId } });
    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    const attempts = await prisma.examAttempt.findMany({
      where: { studentId, status: "submitted" },
      include: {
        exam: { select: { title: true, totalMarks: true, passingMarks: true } },
      },
      orderBy: { submittedAt: "desc" },
    });

    res.json({
      student: student.full_name,
      results: attempts.map((a) => ({
        attempt_id: a.id,
        exam_title: a.exam.title,
        score: a.score ?? 0,
        total_marks: a.exam.totalMarks,
        passed: (a.score ?? 0) >= a.exam.passingMarks,
        submitted_at: a.submittedAt,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res
      .status(500)
      .json({ message: "Failed to fetch student results", error: message });
  }
};

// ════════════════════════════════════════════════════════════════════════
// 7. GET /api/admin/dashboard/stats
//    Overall dashboard summary — admin home page ke liye
// ════════════════════════════════════════════════════════════════════════
export const getDashboardStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const totalStudents = await prisma.user.count({
      where: { role: "student" },
    });
    const totalExams = await prisma.exam.count();
    const totalAttempts = await prisma.examAttempt.count({
      where: { status: "submitted" },
    });

    const submittedAttempts = await prisma.examAttempt.findMany({
      where: { status: "submitted" },
      include: { exam: { select: { passingMarks: true } } },
    });

    const passCount = submittedAttempts.filter(
      (a) => (a.score ?? 0) >= a.exam.passingMarks,
    ).length;

    const passRate =
      submittedAttempts.length > 0
        ? Math.round((passCount / submittedAttempts.length) * 100)
        : 0;

    const stats: DashboardStats = {
      total_students: totalStudents,
      total_exams: totalExams,
      total_attempts: totalAttempts,
      pass_rate: `${passRate}%`,
    };

    res.json(stats);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res
      .status(500)
      .json({ message: "Failed to fetch dashboard stats", error: message });
  }
};
