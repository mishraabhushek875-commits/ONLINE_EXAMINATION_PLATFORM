// src/features/exam/types/exam.types.ts
// Saare TypeScript types for exam attempt flow

export interface ExamOption {
  id: number;
  text: string;
}

export interface ExamQuestion {
  id: number;
  text: string;
  category: string;
  options: ExamOption[];
}

export interface StartExamResponse {
  attemptId: number;
  examId: number;
  examTitle: string;
  totalMarks: number;
  passingMarks: number;
  duration: number; // minutes
  remainingSeconds: number;
  questions: ExamQuestion[];
  savedAnswers: Record<number, number>; // questionId → optionId
}

export interface SubmitExamResponse {
  attemptId: number;
  score: number;
  totalMarks: number;
  passingMarks: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
}

// Dashboard types
export interface AssignedExam {
  assignmentId: number;
  exam: {
    id: number;
    title: string;
    description: string | null;
    duration: number;
    totalMarks: number;
    passingMarks: number;
  };
  attemptStatus: "not_started" | "in_progress" | "submitted" | "expired";
  attemptId: number | null;
  score: number | null;
  passed: boolean | null;
  submittedAt: string | null;
}

export interface LatestResult {
  attemptId: number;
  examTitle: string;
  score: number;
  totalMarks: number;
  passed: boolean;
  submittedAt: string | null;
}

export interface DashboardData {
  student: {
    id: number;
    full_name: string;
    email: string;
  };
  stats: {
    totalAssigned: number;
    completed: number;
    passed: number;
  };
  assignedExams: AssignedExam[];
  latestResults: LatestResult[];
}
