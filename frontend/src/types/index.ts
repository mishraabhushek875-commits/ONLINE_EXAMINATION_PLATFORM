export type UserRole = "admin" | "student";
export type UserStatus = "active" | "inactive";
export type QuestionCat = "Database" | "Node" | "Nextjs" | "Reactjs";
export type AttemptStatus = "in_progress" | "submitted" | "expired";

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

export interface Option {
  id: number;
  text: string;
  questionId: number;
}

export interface Question {
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
  questions?: Question[];
}

export interface Exam {
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
  exam?: Pick<Exam, "id" | "title" | "duration" | "passingMarks" | "totalMarks">;
  student?: Pick<User, "id" | "full_name" | "email" | "phone">;
}

export interface ExamAttempt {
  id: number;
  examId: number;
  studentId: number;
  status: AttemptStatus;
  score: number | null;
  startedAt: string;
  submittedAt: string | null;
  exam?: Pick<Exam, "id" | "title" | "totalMarks" | "passingMarks">;
  student?: Pick<User, "id" | "full_name" | "email">;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalStudents: number;
  totalQuestionBanks: number;
  totalTests: number;
  totalQuestions: number;
}
