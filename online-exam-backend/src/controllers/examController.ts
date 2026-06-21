import { Request, Response } from "express";
import prisma from "../config/db";

// ─── Create Exam ───────────────────────────────
export const createExam = async (req: Request, res: Response) => {
  try {
    const { title, description, duration, passingMarks, totalMarks, questionBankId } = req.body;

    if (!title || !duration || !passingMarks || !totalMarks || !questionBankId) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const bank = await prisma.questionBank.findUnique({ where: { id: questionBankId } });
    if (!bank) {
      return res.status(404).json({ success: false, message: "Question Bank not found" });
    }

    const exam = await prisma.exam.create({
      data: {
        title,
        description,
        duration,
        passingMarks,
        totalMarks,
        questionBankId,
        createdById: req.user!.id,
      },
      include: {
        questionBank: { select: { id: true, title: true } },
        createdBy: { select: { id: true, full_name: true } },
      }
    });

    return res.status(201).json({ success: true, message: "Exam created successfully", data: exam });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── Get All Exams ─────────────────────────────
export const getAllExams = async (req: Request, res: Response) => {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        questionBank: { select: { id: true, title: true } },
        createdBy: { select: { id: true, full_name: true } },
        _count: { select: { assignments: true, attempts: true } }
      }
    });

    return res.status(200).json({ success: true, data: exams });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── Get Single Exam ───────────────────────────
export const getExamById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid exam ID" });
    }

    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        questionBank: {
          include: {
            question: {
              include: {
                question: { include: { options: true } }
              }
            }
          }
        },
        createdBy: { select: { id: true, full_name: true } },
        _count: { select: { assignments: true, attempts: true } }
      }
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    return res.status(200).json({ success: true, data: exam });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── Update Exam ───────────────────────────────
export const updateExam = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid exam ID" });
    }

    const { title, description, duration, passingMarks, totalMarks, questionBankId } = req.body;

    const exam = await prisma.exam.findUnique({ where: { id } });
    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    if (questionBankId) {
      const bank = await prisma.questionBank.findUnique({ where: { id: questionBankId } });
      if (!bank) {
        return res.status(404).json({ success: false, message: "Question Bank not found" });
      }
    }

    const updated = await prisma.exam.update({
      where: { id },
      data: { title, description, duration, passingMarks, totalMarks, questionBankId }
    });

    return res.status(200).json({ success: true, message: "Exam updated successfully", data: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── Delete Exam ───────────────────────────────
export const deleteExam = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid exam ID" });
    }

    await prisma.exam.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Exam deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};