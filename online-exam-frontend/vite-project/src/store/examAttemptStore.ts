import { create } from "zustand";
import type { ExamQuestion, StartExamResponse } from "../types/exam.types";

interface ExamAttemptState {
  // Exam metadata
  attemptId: number | null;
  examId: number | null;
  examTitle: string;
  totalMarks: number;
  passingMarks: number;
  duration: number; // minutes
  remainingSeconds: number;

  // Questions
  questions: ExamQuestion[];
  currentIndex: number;

  // Answers: questionId → optionId
  answers: Record<number, number>;

  // UI state
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Actions
  initExam: (data: StartExamResponse) => void;
  setAnswer: (questionId: number, optionId: number) => void;
  goToNext: () => void;
  goToPrev: () => void;
  goToQuestion: (index: number) => void;
  tickTimer: () => void;
  setLoading: (val: boolean) => void;
  setSubmitting: (val: boolean) => void;
  setError: (msg: string | null) => void;
  resetExam: () => void;
}

export const useExamAttemptStore = create<ExamAttemptState>((set) => ({
  attemptId: null,
  examId: null,
  examTitle: "",
  totalMarks: 0,
  passingMarks: 0,
  duration: 0,
  remainingSeconds: 0,
  questions: [],
  currentIndex: 0,
  answers: {},
  isLoading: false,
  isSubmitting: false,
  error: null,

  initExam: (data) =>
    set({
      attemptId: data.attemptId,
      examId: data.examId,
      examTitle: data.examTitle,
      totalMarks: data.totalMarks,
      passingMarks: data.passingMarks,
      duration: data.duration,
      remainingSeconds: data.remainingSeconds,
      questions: data.questions,
      answers: data.savedAnswers,
      currentIndex: 0,
      error: null,
    }),

  setAnswer: (questionId, optionId) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: optionId },
    })),

  goToNext: () =>
    set((state) => ({
      currentIndex: Math.min(
        state.currentIndex + 1,
        state.questions.length - 1,
      ),
    })),

  goToPrev: () =>
    set((state) => ({
      currentIndex: Math.max(state.currentIndex - 1, 0),
    })),

  goToQuestion: (index) =>
    set((state) => ({
      currentIndex: Math.max(0, Math.min(index, state.questions.length - 1)),
    })),

  tickTimer: () =>
    set((state) => ({
      remainingSeconds: Math.max(0, state.remainingSeconds - 1),
    })),

  setLoading: (val) => set({ isLoading: val }),
  setSubmitting: (val) => set({ isSubmitting: val }),
  setError: (msg) => set({ error: msg }),

  resetExam: () =>
    set({
      attemptId: null,
      examId: null,
      examTitle: "",
      totalMarks: 0,
      passingMarks: 0,
      duration: 0,
      remainingSeconds: 0,
      questions: [],
      currentIndex: 0,
      answers: {},
      isLoading: false,
      isSubmitting: false,
      error: null,
    }),
}));
