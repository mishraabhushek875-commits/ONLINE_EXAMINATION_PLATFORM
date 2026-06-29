import api from "./api";
import { ApiResponse, Question, QuestionCat } from "@/types";

export const questionService = {
  getAll: (params?: { page?: number; limit?: number; category?: QuestionCat }) =>
    api.get<ApiResponse<Question[]>>("/questions", { params }),
  getById: (id: number) => api.get<ApiResponse<Question>>(`/questions/${id}`),
  create: (payload: {
    text: string;
    category: QuestionCat;
    options: string[];
    correctOptionIndexes: number[];
  }) => api.post<ApiResponse<Question>>("/questions", payload),
  remove: (id: number) => api.delete<ApiResponse<null>>(`/questions/${id}`),
};
