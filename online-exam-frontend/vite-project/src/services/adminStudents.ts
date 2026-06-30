import api from "./api";
import type {
  AdminStudent,
  ApiResponse,
  AllResultsResponse,
  DashboardStats,
  ExamResultsSummary,
  StudentResultsAdmin,
} from "../types/admin.types";

const adminStudentService = {
  getAll: async (): Promise<AdminStudent[]> => {
    const { data } = await api.get<ApiResponse<AdminStudent[]>>("/admin/students");
    return data.data;
  },

  getById: async (id: number): Promise<AdminStudent> => {
    const { data } = await api.get<ApiResponse<AdminStudent>>(`/admin/students/${id}`);
    return data.data;
  },

  remove: async (id: number) => {
    const { data } = await api.delete<ApiResponse<{ full_name: string }>>(`/admin/students/${id}`);
    return data;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<DashboardStats>("/admin/students/dashboard/stats");
    return data;
  },

  getAllResults: async (params?: { examId?: number; studentId?: number; passed?: boolean; page?: number; limit?: number }): Promise<AllResultsResponse> => {
    const { data } = await api.get<AllResultsResponse>("/admin/students/results", { params });
    return data;
  },

  getExamResults: async (examId: number): Promise<ExamResultsSummary> => {
    const { data } = await api.get<ExamResultsSummary>(`/admin/students/exams/${examId}/results`);
    return data;
  },

  getStudentResults: async (studentId: number): Promise<StudentResultsAdmin> => {
    const { data } = await api.get<StudentResultsAdmin>(`/admin/students/student/${studentId}/results`);
    return data;
  },
};

export default adminStudentService;