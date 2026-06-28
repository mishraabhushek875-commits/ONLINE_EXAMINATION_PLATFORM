// src/features/exam/services/examAttemptService.ts
// All API calls for exam attempt flow — pure functions, no state

import api from "./api";
import type {
  StartExamResponse,
  SubmitExamResponse,
  DashboardData,
} from "../types/exam.types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── Start Exam ─────────────────────────────────────────────────────────
export const startExamApi = async (
  examId: number,
): Promise<StartExamResponse> => {
  const res = await api.post<ApiResponse<StartExamResponse>>("/attempt/start", {
    examId,
  });
  return res.data.data;
};

// ─── Save Answer (single question) ──────────────────────────────────────
export const saveAnswerApi = async (params: {
  attemptId: number;
  questionId: number;
  optionId: number;
}): Promise<void> => {
  await api.post("/attempt/save-answer", params);
};

// ─── Submit Exam ─────────────────────────────────────────────────────────
export const submitExamApi = async (
  attemptId: number,
): Promise<SubmitExamResponse> => {
  const res = await api.post<ApiResponse<SubmitExamResponse>>(
    "/attempt/submit",
    { attemptId },
  );
  return res.data.data;
};

// ─── Student Dashboard ───────────────────────────────────────────────────
export const getStudentDashboardApi = async (): Promise<DashboardData> => {
  const res = await api.get<ApiResponse<DashboardData>>("/student/dashboard");
  return res.data.data;
};
