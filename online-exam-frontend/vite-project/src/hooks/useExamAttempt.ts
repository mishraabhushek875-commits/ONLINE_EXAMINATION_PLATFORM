import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query"; // 👈 NEW IMPORT
import { useExamAttemptStore } from "../store/examAttemptStore";
import {
  startExamApi,
  saveAnswerApi,
  submitExamApi,
} from "../services/examAttemptService";

export const useExamAttempt = () => {
  const store = useExamAttemptStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // 👈 NEW
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoSubmitRef = useRef(false);

  // ─── Start Exam ──────────────────────────────────────────────────────
  const startExam = useCallback(
    async (examId: number) => {
      store.setLoading(true);
      store.setError(null);
      try {
        const data = await startExamApi(examId);
        store.initExam(data);
      } catch (err: any) {
        const msg =
          err.response?.data?.message || "Failed to start exam. Try again.";
        store.setError(msg);
        throw err;
      } finally {
        store.setLoading(false);
      }
    },
    [store],
  );

  // ─── Select Answer + Auto-Save ───────────────────────────────────────
  const selectAnswer = useCallback(
    async (questionId: number, optionId: number) => {
      // Optimistic update in store
      store.setAnswer(questionId, optionId);

      // Fire-and-forget save to backend
      if (store.attemptId) {
        saveAnswerApi({
          attemptId: store.attemptId,
          questionId,
          optionId,
        }).catch(console.error);
      }
    },
    [store],
  );

  // ─── Submit Exam ─────────────────────────────────────────────────────
  const submitExam = useCallback(
    async (isAutoSubmit = false) => {
      if (!store.attemptId || store.isSubmitting) return;
      if (autoSubmitRef.current) return;
      autoSubmitRef.current = true;

      store.setSubmitting(true);
      if (timerRef.current) clearInterval(timerRef.current);

      try {
        const result = await submitExamApi(store.attemptId);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["studentDashboard"] }),
          queryClient.invalidateQueries({ queryKey: ["myResults"] }),
          queryClient.invalidateQueries({ queryKey: ["my-results"] }), 
        ]);

        store.resetExam();
        navigate("/", {
          state: { latestResult: result, fromExam: true },
          replace: true,
        });
      } catch (err: any) {
        const msg =
          err.response?.data?.message || "Failed to submit exam. Try again.";
        store.setError(msg);
        store.setSubmitting(false);
        autoSubmitRef.current = false;
      }
    },
    [store, navigate, queryClient],
  );

  // ─── Timer ──────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      store.tickTimer();

      // Check if time is up
      const remaining = useExamAttemptStore.getState().remainingSeconds;
      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        submitExam(true); // auto submit
      }
    }, 1000);
  }, [store, submitExam]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ─── Tab Visibility / Anti-Cheat ────────────────────────────────────
  const setupAntiCheat = useCallback(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && store.attemptId) {
        // Warn — we can increment a violation counter here
        console.warn("[MAT TEST] Tab switch detected");
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.key === "u") ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [store.attemptId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return {
    // State
    ...store,
    currentQuestion: store.questions[store.currentIndex] ?? null,
    answeredCount: Object.keys(store.answers).length,
    isLastQuestion: store.currentIndex === store.questions.length - 1,
    isFirstQuestion: store.currentIndex === 0,
    formattedTime: formatTime(store.remainingSeconds),
    isTimeWarning: store.remainingSeconds <= 300, // last 5 min
    isCriticalTime: store.remainingSeconds <= 60, // last 1 min

    // Actions
    startExam,
    selectAnswer,
    submitExam,
    startTimer,
    setupAntiCheat,
    goToNext: store.goToNext,
    goToPrev: store.goToPrev,
    goToQuestion: store.goToQuestion,
  };
};
