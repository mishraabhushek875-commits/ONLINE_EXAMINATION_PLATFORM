import api from "./api";
import type { AdminQuestion, ApiResponse, QuestionCat } from "../types/admin.types";

const questionService = {
  getAll: async (params?: { page?: number; limit?: number; category?: QuestionCat }): Promise<AdminQuestion[]> => {
    const { data } = await api.get<ApiResponse<AdminQuestion[]>>("/questions", { params });
    return data.data;
  },

  getById: async (id: number): Promise<AdminQuestion> => {
    const { data } = await api.get<ApiResponse<AdminQuestion>>(`/questions/${id}`);
    return data.data;
  },

  create: async (payload: {
    text: string;
    category: QuestionCat;
    options: string[];
    correctOptionIndexes: number[];
  }): Promise<AdminQuestion> => {
    const { data } = await api.post<ApiResponse<AdminQuestion>>("/questions", payload);
    return data.data;
  },

  remove: async (id: number) => {
    const { data } = await api.delete<ApiResponse<null>>(`/questions/${id}`);
    return data;
  },
};

export default questionService;