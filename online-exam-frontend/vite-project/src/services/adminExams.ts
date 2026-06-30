import api from "./api";
import type { AdminExam, ApiResponse } from "../types/admin.types";

const adminExamService = {
  getAll: async (): Promise<AdminExam[]> => {
    const { data } = await api.get<ApiResponse<AdminExam[]>>("/exams");
    return data.data;
  },

  getById: async (id: number): Promise<AdminExam> => {
    const { data } = await api.get<ApiResponse<AdminExam>>(`/exams/${id}`);
    return data.data;
  },

  create: async (payload: {
    title: string;
    description?: string;
    duration: number;
    passingMarks: number;
    totalMarks: number;
    questionBankId: number;
  }): Promise<AdminExam> => {
    const { data } = await api.post<ApiResponse<AdminExam>>("/exams", payload);
    return data.data;
  },

  update: async (id: number, payload: Partial<AdminExam>): Promise<AdminExam> => {
    const { data } = await api.patch<ApiResponse<AdminExam>>(`/exams/${id}`, payload);
    return data.data;
  },

  remove: async (id: number) => {
    const { data } = await api.delete<ApiResponse<null>>(`/exams/${id}`);
    return data;
  },
};

export default adminExamService;