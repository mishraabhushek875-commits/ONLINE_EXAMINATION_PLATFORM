import api from "./api";
import { ApiResponse, QuestionBank } from "@/types";

export const bankService = {
  getAll: () => api.get<ApiResponse<QuestionBank[]>>("/banks"),
  getById: (id: number) => api.get<ApiResponse<QuestionBank>>(`/banks/${id}`),
  create: (title: string) => api.post<ApiResponse<QuestionBank>>("/banks", { title }),
  update: (id: number, title: string, questionIds: number[]) =>
    api.patch<ApiResponse<QuestionBank>>(`/banks/${id}`, { title, questionIds }),
  remove: (id: number) => api.delete<ApiResponse<null>>(`/banks/${id}`),
};
