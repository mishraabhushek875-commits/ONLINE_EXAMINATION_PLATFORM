import { Request, Response } from "express";
import prisma from "../config/db";

export const createBank = async (req: Request, res: Response) => {
  const { title } = req.body;
  try {
    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Title must be at least 3 characters long",
      });
    }
    const bank = await prisma.questionBank.create({
      data: { title },
    });
    res.status(201).json({
      success: true,
      message: "Bank created successfully",
      data: bank,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const updateBank = async (req: Request, res: Response) => {
  try {
    const { title, questionIds } = req.body;
    const id = parseInt(req.params.id as string);
    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Title must be at least 3 characters long",
      });
    }
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid bank ID" });
    }
    if (!questionIds || questionIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "At least 1 question is required" });
    }
    const bank = await prisma.questionBank.findUnique({
      where: {
        id,
      },
    });
    if (!bank) {
      return res
        .status(404)
        .json({ success: false, message: "Question bank not exists" });
    }
    const existingQuestions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
      select: { id: true },
    });

    const existingIds = existingQuestions.map((q) => q.id);
    const invalidIds = questionIds.filter(
      (qId: number) => !existingIds.includes(qId),
    );
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid question IDs: ${invalidIds.join(", ")}`,
      });
    }
    const updatedBank = await prisma.$transaction(async (tx) => {
      // Step A: title update (agar bheja gaya hai)
      if (title) {
        await tx.questionBank.update({
          where: { id },
          data: { title },
        });
      }

      // Step B: purane links delete karo
      await tx.questionBankQuestion.deleteMany({
        where: { questionBankId: id },
      });

      // Step C: naye links create karo
      await tx.questionBankQuestion.createMany({
        data: questionIds.map((questionId: number) => ({
          questionId,
          questionBankId: id,
        })),
      });

      // Step D: final updated data fetch karo (response ke liye)
      return tx.questionBank.findUnique({
        where: { id },
        include: { question: { include: { question: true } } },
      });
    });
    if (!updatedBank) {
      return res.status(404).json({
        success: false,
        message: "Question Bank not found after update",
      });
    }

    const flattened = {
      id: updatedBank.id,
      title: updatedBank.title,
      questions: updatedBank.question.map((link) => link.question),
    };

    return res.status(200).json({
      success: true,
      data: flattened,
      message: "Question Bank updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteBank = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Question bank id" });
    }
    await prisma.questionBank.delete({ where: { id } });
    return res
      .status(200)
      .json({ success: true, message: "Question bank deleted successfully" });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Question Bank not found" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllBanks = async (req: Request, res: Response) => {
  try {
    console.log("hit");

    const banks = await prisma.questionBank.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            question: true,
          },
        },
      },
    });
    res.status(200).json({ success: true, data: banks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const getBankFromId = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Question bank id" });
    }
    const bank = await prisma.questionBank.findUnique({
      where: {
        id,
      },
      include: {
        question: {
          include: {
            question: {
              include: { options: true },
            },
          },
        },
      },
    });
    if (!bank) {
      return res
        .status(404)
        .json({ success: false, message: "Question Bank not found" });
    }
    const flattened = {
      id: bank.id,
      title: bank.title,
      createdAt: bank.createdAt,
      questions: bank.question.map((link) => link.question),
    };

    return res.status(200).json({ success: true, data: flattened });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};
