import api from "./api";
import type { ApiResponse, ExamAssignment } from "../types/admin.types";

const assignmentService = {
  assignOne: async (examId: number, studentId: number) => {
    const { data } = await api.post<ApiResponse<ExamAssignment>>(`/admin/exams/${examId}/assign`, { studentId });
    return data;
  },

  assignBulk: async (examId: number, studentIds: number[]) => {
    const { data } = await api.post<{ success: boolean; message: string; skipped: number }>(
      `/admin/exams/${examId}/assign/bulk`,
      { studentIds },
    );
    return data;
  },

  getAssignedStudents: async (examId: number): Promise<ExamAssignment[]> => {
    const { data } = await api.get<ApiResponse<ExamAssignment[]>>(`/admin/exams/${examId}/assigned-students`);
    return data.data;
  },

  getStudentAssignedExams: async (studentId: number): Promise<ExamAssignment[]> => {
    const { data } = await api.get<ApiResponse<ExamAssignment[]>>(`/admin/exams/student/${studentId}/assigned-exams`);
    return data.data;
  },

  remove: async (examId: number, studentId: number) => {
    const { data } = await api.delete<ApiResponse<null>>(`/admin/exams/${examId}/assign/${studentId}`);
    return data;
  },
};

export default assignmentService;