import { Request, Response } from "express";
import prisma from "../config/db";

// ─── Single Student Assign ─────────────────────
export const assignExamToStudent = async (req: Request, res: Response) => {
  try {
    const examId = parseInt(req.params.examId as string);
    const { studentId } = req.body;

    if (isNaN(examId) || !studentId) {
      return res
        .status(400)
        .json({ success: false, message: "examId and studentId required" });
    }

    // Exam exist karta hai?
    const exam = await prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found" });
    }

    // Student exist karta hai aur student role hai?
    const student = await prisma.user.findUnique({ where: { id: studentId } });
    if (!student || student.role !== "student") {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const assignment = await prisma.examAssignment.create({
      data: { examId, studentId },
      include: {
        exam: { select: { id: true, title: true } },
        student: { select: { id: true, full_name: true, email: true } },
      },
    });

    return res
      .status(201)
      .json({
        success: true,
        message: "Exam assigned successfully",
        data: assignment,
      });
  } catch (error: any) {
    // Duplicate assign
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Exam already assigned to this student",
        });
    }
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// ─── Bulk Assign ───────────────────────────────
export const bulkAssignExam = async (req: Request, res: Response) => {
  try {
    const examId = parseInt(req.params.examId as string);
    const { studentIds } = req.body; // [1, 2, 3, ...]

    if (isNaN(examId) || !studentIds || studentIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "examId and studentIds required" });
    }

    const exam = await prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found" });
    }

    // Already assigned students nikaalo
    const existing = await prisma.examAssignment.findMany({
      where: { examId, studentId: { in: studentIds } },
      select: { studentId: true },
    });
    const existingIds = existing.map((e) => e.studentId);
    const newIds = studentIds.filter((id: number) => !existingIds.includes(id));

    if (newIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "All students already assigned" });
    }

    await prisma.examAssignment.createMany({
      data: newIds.map((studentId: number) => ({ examId, studentId })),
    });

    return res.status(201).json({
      success: true,
      message: `${newIds.length} students assigned successfully`,
      skipped: existingIds.length,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// ─── Get Assigned Students of Exam ─────────────
export const getAssignedStudents = async (req: Request, res: Response) => {
  try {
    const examId = parseInt(req.params.examId as string);
    if (isNaN(examId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid exam ID" });
    }

    const assignments = await prisma.examAssignment.findMany({
      where: { examId },
      include: {
        student: {
          select: { id: true, full_name: true, email: true, phone: true },
        },
      },
    });

    return res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// ─── Get Assigned Exams of Student ─────────────
export const getStudentAssignedExams = async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.studentId as string);
    if (isNaN(studentId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student ID" });
    }

    const assignments = await prisma.examAssignment.findMany({
      where: { studentId },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            duration: true,
            passingMarks: true,
            totalMarks: true,
          },
        },
      },
    });

    return res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// ─── Remove Assignment ─────────────────────────
export const removeAssignment = async (req: Request, res: Response) => {
  try {
    const examId = parseInt(req.params.examId as string);
    const studentId = parseInt(req.params.studentId as string);

    if (isNaN(examId) || isNaN(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid IDs" });
    }

    await prisma.examAssignment.deleteMany({
      where: { examId, studentId },
    });

    return res
      .status(200)
      .json({ success: true, message: "Assignment removed successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
