import { Request, Response } from "express";
import prisma from "../config/db";

export const getStudentDashboard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const studentId = req.user!.id;

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { id: true, full_name: true, email: true },
    });

    // Assigned exams with attempt status
    const assignments = await prisma.examAssignment.findMany({
      where: { studentId },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            totalMarks: true,
            passingMarks: true,
          },
        },
      },
    });

    // Har exam ke liye attempt status fetch karo
    const examIds = assignments.map((a) => a.exam.id);
    const attempts = await prisma.examAttempt.findMany({
      where: { studentId, examId: { in: examIds } },
      select: {
        examId: true,
        status: true,
        score: true,
        passed: true,
        submittedAt: true,
        id: true,
      },
      orderBy: { startedAt: "desc" },
    });

    // Map examId → latest attempt
    const attemptMap: Record<number, (typeof attempts)[0]> = {};
    for (const attempt of attempts) {
      if (!attemptMap[attempt.examId]) {
        attemptMap[attempt.examId] = attempt;
      }
    }

    const assignedExams = assignments.map((a) => ({
      assignmentId: a.id,
      exam: a.exam,
      attemptStatus: attemptMap[a.exam.id]?.status ?? "not_started",
      attemptId: attemptMap[a.exam.id]?.id ?? null,
      score: attemptMap[a.exam.id]?.score ?? null,
      passed: attemptMap[a.exam.id]?.passed ?? null,
      submittedAt: attemptMap[a.exam.id]?.submittedAt ?? null,
    }));

    // Latest 5 results
    const latestResults = await prisma.examAttempt.findMany({
      where: { studentId, status: "submitted" },
      include: {
        exam: { select: { title: true, totalMarks: true, passingMarks: true } },
      },
      orderBy: { submittedAt: "desc" },
      take: 5,
    });

    const stats = {
      totalAssigned: assignments.length,
      completed: Object.values(attemptMap).filter(
        (a) => a.status === "submitted",
      ).length,
      passed: Object.values(attemptMap).filter((a) => a.passed === true).length,
    };

    res.status(200).json({
      success: true,
      data: {
        student,
        stats,
        assignedExams,
        latestResults: latestResults.map((a) => ({
          attemptId: a.id,
          examTitle: a.exam.title,
          score: a.score ?? 0,
          totalMarks: a.exam.totalMarks,
          passed: (a.score ?? 0) >= a.exam.passingMarks,
          submittedAt: a.submittedAt,
        })),
      },
    });
  } catch (error) {
    console.error("getStudentDashboard error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
