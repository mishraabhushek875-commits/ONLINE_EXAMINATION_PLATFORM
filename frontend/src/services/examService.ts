import api from "./api";
import { ApiResponse, Exam } from "@/types";

export const examService = {
  getAll: () => api.get<ApiResponse<Exam[]>>("/exams"),
  getById: (id: number) => api.get<ApiResponse<Exam>>(`/exams/${id}`),
  create: (payload: Partial<Exam>) => api.post<ApiResponse<Exam>>("/exams", payload),
  update: (id: number, payload: Partial<Exam>) =>
    api.patch<ApiResponse<Exam>>(`/exams/${id}`, payload),
  remove: (id: number) => api.delete<ApiResponse<null>>(`/exams/${id}`),
};
