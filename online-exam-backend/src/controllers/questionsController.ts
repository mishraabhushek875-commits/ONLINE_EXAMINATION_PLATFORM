import { Request, Response } from "express";
import prisma from "../config/db";
import { QuestionCat } from "@prisma/client";

interface CreateQuestionBody {
  text: string;
  category: QuestionCat;
  options: string[];
  correctOptionIndexes: number[];
}

export const createQuestion = async (
  req: Request<{}, {}, CreateQuestionBody>,
  res: Response,
) => {
  const { text, category, options, correctOptionIndexes } = req.body;

  try {
    if (!text || !category || !options || !correctOptionIndexes) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }
    if (text.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Question text must be at least 10 characters long",
      });
    }
    if (!options || options.length < 4) {
      return res
        .status(400)
        .json({ success: false, message: "At least 4 options are required" });
    }

    if (!correctOptionIndexes || correctOptionIndexes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one correct answer is required",
      });
    }
    const question = await prisma.question.create({
      data: {
        text,
        category,
        options: {
          create: options.map((text) => ({ text })),
        },
      },
      include: {
        options: true,
      },
    });

    const correctOptions = correctOptionIndexes.map(
      (index) => question.options[index],
    );
    console.log(question);
    console.log(correctOptions);
    if (correctOptions.some((opt) => !opt)) {
      return res.status(400).json({
        success: false,
        message: "Invalid correct option index provided",
      });
    }

    await prisma.answer.createMany({
      data: correctOptions.map((opt) => ({
        questionId: question.id,
        optionId: opt.id,
      })),
    });
    return res.status(201).json({
      success: true,
      data: question,
      msg: "Question created successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const { category } = req.query;
    const validCategories = Object.values(QuestionCat);
    if (category && !validCategories.includes(category as QuestionCat)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Valid options: ${validCategories.join(", ")}`,
      });
    }
    const questions = await prisma.question.findMany({
      where: category ? { category: category as QuestionCat } : {},
      skip,
      take: limit,
      include: {
        options: true,
      },
    });
    const total = await prisma.question.count();

    res.status(200).json({
      success: true,
      data: questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid question ID" });
    }
    const Question = await prisma.question.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Question deleted succesfully",
      data: Question,
    });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getQuestion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid question ID" });
    }
    const question = await prisma.question.findUnique({
      where: {
        id,
      },
    });
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }
    return res.status(200).json({ success: true, data: question });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
