import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import adminStudentService from "../services/adminStudents";
import adminExamService from "../services/adminExams";
import bankService from "../services/bank";
import questionService from "../services/question";
import assignmentService from "../services/assignment";
import type { AdminExam, QuestionCat } from "../types/admin.types";

// ─── Dashboard ──────────────────────────────────────────────────
export const useAdminDashboard = () =>
  useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: adminStudentService.getDashboardStats,
  });

// ─── Students ───────────────────────────────────────────────────
export const useAdminStudents = () =>
  useQuery({
    queryKey: ["admin", "students"],
    queryFn: adminStudentService.getAll,
  });

export const useDeleteStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminStudentService.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "students"] }),
  });
};

// ─── Exams ──────────────────────────────────────────────────────
export const useAdminExams = () =>
  useQuery({
    queryKey: ["admin", "exams"],
    queryFn: adminExamService.getAll,
  });

export const useCreateExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminExamService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "exams"] }),
  });
};

export const useDeleteExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminExamService.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "exams"] }),
  });
};

// ─── Question Banks ─────────────────────────────────────────────
export const useQuestionBanks = () =>
  useQuery({
    queryKey: ["admin", "banks"],
    queryFn: bankService.getAll,
  });

export const useCreateBank = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (title: string) => bankService.create(title),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "banks"] }),
  });
};

export const useDeleteBank = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bankService.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "banks"] }),
  });
};

// ─── Questions ──────────────────────────────────────────────────
export const useAdminQuestions = (category?: QuestionCat | "") =>
  useQuery({
    queryKey: ["admin", "questions", category],
    queryFn: () => questionService.getAll({ limit: 200, category: category || undefined }),
  });

export const useCreateQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: questionService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "questions"] }),
  });
};

export const useDeleteQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: questionService.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "questions"] }),
  });
};

// ─── Assignments ────────────────────────────────────────────────
export const useAssignedStudents = (examId: number | "") =>
  useQuery({
    queryKey: ["admin", "assignments", examId],
    queryFn: () => assignmentService.getAssignedStudents(examId as number),
    enabled: examId !== "",
  });

export const useBulkAssign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, studentIds }: { examId: number; studentIds: number[] }) =>
      assignmentService.assignBulk(examId, studentIds),
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ["admin", "assignments", vars.examId] }),
  });
};

export const useRemoveAssignment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, studentId }: { examId: number; studentId: number }) =>
      assignmentService.remove(examId, studentId),
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ["admin", "assignments", vars.examId] }),
  });
};

// ─── Results ────────────────────────────────────────────────────
export const useAdminResults = (params?: { examId?: number; studentId?: number }) =>
  useQuery({
    queryKey: ["admin", "results", params],
    queryFn: () => adminStudentService.getAllResults(params),
  });

export const useExamResults = (examId: number | "") =>
  useQuery({
    queryKey: ["admin", "exam-results", examId],
    queryFn: () => adminStudentService.getExamResults(examId as number),
    enabled: examId !== "",
  });

export type { AdminExam };