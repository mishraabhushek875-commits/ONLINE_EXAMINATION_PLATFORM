
export interface MyResultItem {
  attempt_id: number;
  exam_title: string;
  score: number;
  total_marks: number;
  passed: boolean;
  submitted_at: Date | null;
}

export interface QuestionReview {
  question_text: string;
  options?: { id: number; text: string }[];
  selected_option_id: number | null;
  correct_option_id: number | undefined;
  is_correct: boolean;
}

export interface ResultDetail {
  attempt_id: number;
  exam_title: string;
  score: number;
  total_marks: number;
  passed: boolean;
  submitted_at: Date | null;
  questions: QuestionReview[];
}

export interface AdminResultItem {
  attempt_id: number;
  student: string;
  student_email: string;
  exam_title: string;
  score: number;
  total_marks: number;
  passed: boolean;
  submitted_at: Date | null;
}

export interface ExamResultsSummary {
  exam_title: string;
  total_appeared: number;
  pass_count: number;
  fail_count: number;
  average_score: number;
  results: { attempt_id: number; student: string; score: number; passed: boolean }[];
}

export interface DashboardStats {
  total_students: number;
  total_exams: number;
  total_attempts: number;
  pass_rate: string;
}

// Query params for GET /api/admin/results
export interface ResultsQuery {
  examId?: string;
  studentId?: string;
  passed?: string;
  page?: string;
  limit?: string;
}