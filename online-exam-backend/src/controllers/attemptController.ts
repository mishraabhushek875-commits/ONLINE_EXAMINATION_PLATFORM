// src/controllers/attemptController.ts
// Student Exam Attempt — Start, Save Answer, Submit
// 3 APIs cover the complete exam-taking flow

import { Request, Response } from "express";
import prisma from "../config/db";

// ════════════════════════════════════════════════════════════════════════
// 1. POST /api/attempt/start
//    Student exam start karta hai — new ExamAttempt create hota hai
//    agar already in_progress attempt hai toh wahi return karo (resume)
// ════════════════════════════════════════════════════════════════════════
export const startExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id;
    const { examId } = req.body;

    if (!examId) {
      res.status(400).json({ success: false, message: "examId is required" });
      return;
    }

    const id = parseInt(examId as string);

    // Exam exist karta hai?
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        questionBank: {
          include: {
            question: {
              include: {
                question: {
                  include: { options: true },
                },
              },
            },
          },
        },
      },
    });

    if (!exam) {
      res.status(404).json({ success: false, message: "Exam not found" });
      return;
    }

    // Student ko yeh exam assign hua hai?
    const assignment = await prisma.examAssignment.findUnique({
      where: {
        examId_studentId: { examId: id, studentId },
      },
    });

    if (!assignment) {
      res.status(403).json({
        success: false,
        message: "You are not assigned to this exam",
      });
      return;
    }

    // Already submitted attempt hai? Re-attempt allowed nahi
    const submittedAttempt = await prisma.examAttempt.findFirst({
      where: { examId: id, studentId, status: "submitted" },
    });

    if (submittedAttempt) {
      res.status(400).json({
        success: false,
        message: "You have already submitted this exam",
        attemptId: submittedAttempt.id,
      });
      return;
    }

    // Resume: agar in_progress attempt already hai
    let attempt = await prisma.examAttempt.findFirst({
      where: { examId: id, studentId, status: "in_progress" },
      include: { studentAnswers: true },
    });

    if (!attempt) {
      attempt = await prisma.examAttempt.create({
        data: { examId: id, studentId, status: "in_progress" },
        include: { studentAnswers: true },
      });
    }

    // Questions flatten karo — options shuffle karo for fairness
    const questions = exam.questionBank.question.map((link) => ({
      id: link.question.id,
      text: link.question.text,
      category: link.question.category,
      options: link.question.options.map((o) => ({ id: o.id, text: o.text })),
    }));

    // Time remaining calculate karo (agar resume)
    const elapsed = Math.floor(
      (Date.now() - new Date(attempt.startedAt).getTime()) / 1000,
    );
    const totalSeconds = exam.duration * 60;
    const remainingSeconds = Math.max(0, totalSeconds - elapsed);

    // Saved answers map (questionId → optionId)
    const savedAnswers: Record<number, number> = {};
    attempt.studentAnswers.forEach((sa) => {
      savedAnswers[sa.questionId] = sa.optionId;
    });

    res.status(200).json({
      success: true,
      data: {
        attemptId: attempt.id,
        examId: exam.id,
        examTitle: exam.title,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        duration: exam.duration,
        remainingSeconds,
        questions,
        savedAnswers,
      },
    });
  } catch (error) {
    console.error("startExam error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ════════════════════════════════════════════════════════════════════════
// 2. POST /api/attempt/save-answer
//    Student ek question ka answer save karta hai (upsert)
//    Tab bhi kaam karta hai agar answer change kare
// ════════════════════════════════════════════════════════════════════════
export const saveAnswer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const studentId = req.user!.id;
    const { attemptId, questionId, optionId } = req.body;

    if (!attemptId || !questionId || !optionId) {
      res.status(400).json({
        success: false,
        message: "attemptId, questionId, and optionId are required",
      });
      return;
    }

    // Attempt ownership verify karo
    const attempt = await prisma.examAttempt.findFirst({
      where: { id: parseInt(attemptId), studentId, status: "in_progress" },
    });

    if (!attempt) {
      res.status(403).json({
        success: false,
        message: "Active attempt not found or not authorized",
      });
      return;
    }

    // Timer expired check — agar time over ho gaya toh auto-submit
    const elapsed = Math.floor(
      (Date.now() - new Date(attempt.startedAt).getTime()) / 1000,
    );
    const exam = await prisma.exam.findUnique({
      where: { id: attempt.examId },
    });
    if (exam && elapsed >= exam.duration * 60) {
      // Auto-submit
      await autoSubmit(attempt.id, attempt.examId);
      res.status(400).json({
        success: false,
        message: "Exam time has expired. Your attempt has been auto-submitted.",
      });
      return;
    }

    // Upsert answer
    await prisma.studentAnswer.upsert({
      where: {
        attemptId_questionId: {
          attemptId: parseInt(attemptId),
          questionId: parseInt(questionId),
        },
      },
      update: { optionId: parseInt(optionId) },
      create: {
        attemptId: parseInt(attemptId),
        questionId: parseInt(questionId),
        optionId: parseInt(optionId),
      },
    });

    res.status(200).json({ success: true, message: "Answer saved" });
  } catch (error) {
    console.error("saveAnswer error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ════════════════════════════════════════════════════════════════════════
// 3. POST /api/attempt/submit
//    Student exam submit karta hai — score calculate hota hai
//    AttemptStatus → submitted, score + passed set hota hai
// ════════════════════════════════════════════════════════════════════════
export const submitExam = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const studentId = req.user!.id;
    const { attemptId } = req.body;

    if (!attemptId) {
      res
        .status(400)
        .json({ success: false, message: "attemptId is required" });
      return;
    }

    const attempt = await prisma.examAttempt.findFirst({
      where: { id: parseInt(attemptId), studentId },
    });

    if (!attempt) {
      res.status(404).json({
        success: false,
        message: "Attempt not found or not authorized",
      });
      return;
    }

    if (attempt.status === "submitted") {
      res.status(400).json({
        success: false,
        message: "This attempt has already been submitted",
      });
      return;
    }

    const result = await autoSubmit(parseInt(attemptId), attempt.examId);

    res.status(200).json({
      success: true,
      message: "Exam submitted successfully",
      data: result,
    });
  } catch (error) {
    console.error("submitExam error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ════════════════════════════════════════════════════════════════════════
// Helper: Score calculate karo aur attempt submit karo
// ════════════════════════════════════════════════════════════════════════
async function autoSubmit(attemptId: number, examId: number) {
  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam) throw new Error("Exam not found");

  // Saare student answers aur correct answers fetch karo
  const studentAnswers = await prisma.studentAnswer.findMany({
    where: { attemptId },
    include: {
      question: { include: { answer: true } },
    },
  });

  // Total questions in this exam's question bank
  const totalQuestions = await prisma.questionBankQuestion.count({
    where: { questionBankId: exam.questionBankId },
  });

  const marksPerQuestion =
    totalQuestions > 0 ? exam.totalMarks / totalQuestions : 0;

  let correctCount = 0;
  for (const sa of studentAnswers) {
    const correctOptionId = sa.question.answer[0]?.optionId;
    if (sa.optionId === correctOptionId) correctCount++;
  }

  const score = Math.round(correctCount * marksPerQuestion);
  const passed = score >= exam.passingMarks;

  const updatedAttempt = await prisma.examAttempt.update({
    where: { id: attemptId },
    data: {
      status: "submitted",
      submittedAt: new Date(),
      score,
      passed,
    },
  });

  return {
    attemptId,
    score,
    totalMarks: exam.totalMarks,
    passingMarks: exam.passingMarks,
    passed,
    correctCount,
    totalQuestions,
  };
}
