import api from "./api";
import { ApiResponse, AttemptStatus, ExamAttempt } from "@/types";

// NOTE: your backend doesn't expose an attempts-listing route yet.
// Add an attemptController + route (admin-only), e.g.:
//   GET /api/admin/attempts?examId=&studentId=&status=
// that does prisma.examAttempt.findMany({ include: { exam: true, student: true } })
export const attemptService = {
  getAll: (params?: { examId?: number; studentId?: number; status?: AttemptStatus }) =>
    api.get<ApiResponse<ExamAttempt[]>>("/admin/attempts", { params }),
};
