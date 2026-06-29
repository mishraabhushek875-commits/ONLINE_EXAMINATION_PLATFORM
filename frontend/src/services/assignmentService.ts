import api from "./api";
import { ApiResponse, ExamAssignment } from "@/types";

export const assignmentService = {
  assignOne: (examId: number, studentId: number) =>
    api.post<ApiResponse<ExamAssignment>>(`/admin/exams/${examId}/assign`, { studentId }),

  assignBulk: (examId: number, studentIds: number[]) =>
    api.post<ApiResponse<null>>(`/admin/exams/${examId}/assign/bulk`, { studentIds }),

  getAssignedStudents: (examId: number) =>
    api.get<ApiResponse<ExamAssignment[]>>(`/admin/exams/${examId}/assigned-students`),

  getStudentExams: (studentId: number) =>
    api.get<ApiResponse<ExamAssignment[]>>(`/admin/exams/student/${studentId}/assigned-exams`),

  remove: (examId: number, studentId: number) =>
    api.delete<ApiResponse<null>>(`/admin/exams/${examId}/assign/${studentId}`),
};
