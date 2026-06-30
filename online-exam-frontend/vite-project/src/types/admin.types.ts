export type QuestionCat = "Database" | "Node" | "Nextjs" | "Reactjs";
export type AttemptStatus = "in_progress" | "submitted" | "expired";

export interface AdminStudent {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  attempts?: { id: number; status: AttemptStatus; score: number | null; passed: boolean | null }[];
  assignedExams?: { id: number; examId: number; studentId: number }[];
  updated_at?: string;
}

export interface Option {
  id: number;
  text: string;
  questionId: number;
}

export interface AdminQuestion {
  id: number;
  text: string;
  category: QuestionCat;
  options?: Option[];
}

export interface QuestionBank {
  id: number;
  title: string;
  createdAt: string;
  _count?: { question: number };
  questions?: AdminQuestion[];
}

export interface AdminExam {
  id: number;
  title: string;
  description?: string | null;
  duration: number;
  passingMarks: number;
  totalMarks: number;
  createdById: number;
  questionBankId: number;
  createdAt: string;
  updatedAt: string;
  questionBank?: { id: number; title: string };
  createdBy?: { id: number; full_name: string };
  _count?: { assignments: number; attempts: number };
}

export interface ExamAssignment {
  id: number;
  examId: number;
  studentId: number;
  assignedAt: string;
  exam?: Pick<AdminExam, "id" | "title" | "duration" | "passingMarks" | "totalMarks">;
  student?: Pick<AdminStudent, "id" | "full_name" | "email" | "phone">;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ─── Dashboard / Results (matches resultController.ts exactly) ────
export interface DashboardStats {
  total_students: number;
  total_exams: number;
  total_attempts: number;
  pass_rate: string;
}

export interface AdminResultItem {
  attempt_id: number;
  student: string;
  student_email: string;
  exam_title: string;
  score: number;
  total_marks: number;
  passed: boolean;
  submitted_at: string | null;
}

export interface AllResultsResponse {
  results: AdminResultItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ExamResultsSummary {
  exam_title: string;
  total_appeared: number;
  pass_count: number;
  fail_count: number;
  average_score: number;
  results: { attempt_id: number; student: string; score: number; passed: boolean }[];
}

export interface StudentResultsAdmin {
  student: string;
  results: {
    attempt_id: number;
    exam_title: string;
    score: number;
    total_marks: number;
    passed: boolean;
    submitted_at: string | null;
  }[];
}