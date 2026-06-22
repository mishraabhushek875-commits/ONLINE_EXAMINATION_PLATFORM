import { Response, Request } from "express";
import prisma from "../config/db";

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: "student",
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        status: true,
        attempts: true,
        assignedExams: true,
      },
    });
    return res.status(200).json({ success: true, data: students });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const getStudentById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  try {
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }
    const student = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        status: true,
        attempts: true,
        assignedExams: true,
        updated_at: true,
      },
    });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    return res.status(200).json({ success: true, data: student });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id not found",
      });
    }
    const student = await prisma.user.delete({
      where: {
        id,
      },
      select: {
        full_name: true,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: student,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

