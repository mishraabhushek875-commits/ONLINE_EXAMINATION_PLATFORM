import api from "./api";
import type { ApiResponse, QuestionBank } from "../types/admin.types";

const bankService = {
  getAll: async (): Promise<QuestionBank[]> => {
    const { data } = await api.get<ApiResponse<QuestionBank[]>>("/banks");
    return data.data;
  },

  getById: async (id: number): Promise<QuestionBank> => {
    const { data } = await api.get<ApiResponse<QuestionBank>>(`/banks/${id}`);
    return data.data;
  },

  create: async (title: string): Promise<QuestionBank> => {
    const { data } = await api.post<ApiResponse<QuestionBank>>("/banks", { title });
    return data.data;
  },

  update: async (id: number, title: string, questionIds: number[]): Promise<QuestionBank> => {
    const { data } = await api.patch<ApiResponse<QuestionBank>>(`/banks/${id}`, { title, questionIds });
    return data.data;
  },

  remove: async (id: number) => {
    const { data } = await api.delete<ApiResponse<null>>(`/banks/${id}`);
    return data;
  },
};

export default bankService;