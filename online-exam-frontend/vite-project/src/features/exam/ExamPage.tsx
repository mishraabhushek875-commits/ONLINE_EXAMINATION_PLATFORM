// src/features/exam/pages/ExamPage.tsx
// Main exam interface — professional, locked, anti-cheat enabled

import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaFlag,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdOutlineNavigateNext } from "react-icons/md";
import { useExamAttempt } from "../../hooks/useExamAttempt";

// ─── Submit Confirmation Modal ────────────────────────────────────────
const SubmitModal = ({
  answeredCount,
  totalCount,
  onConfirm,
  onCancel,
  isSubmitting,
}: {
  answeredCount: number;
  totalCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) => {
  const unanswered = totalCount - answeredCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-3xl border border-white bg-white p-8 shadow-2xl">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-orange-100 p-4">
            <FaFlag className="text-orange-500" size={28} />
          </div>
        </div>
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
          Submit Exam?
        </h2>
        <p className="mb-6 text-center text-gray-500">
          This action cannot be undone. Please review your progress before
          submitting.
        </p>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-emerald-50 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {answeredCount}
            </p>
            <p className="text-xs text-gray-500">Answered</p>
          </div>
          <div className="rounded-2xl bg-red-50 p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{unanswered}</p>
            <p className="text-xs text-gray-500">Unanswered</p>
          </div>
        </div>

        {unanswered > 0 && (
          <div className="mb-5 flex items-start gap-2 rounded-xl bg-orange-50 border border-orange-200 p-3 text-sm text-orange-700">
            <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
            <span>
              You have <strong>{unanswered}</strong> unanswered question
              {unanswered > 1 ? "s" : ""}. Skipped questions will not earn any
              marks.
            </span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            Review Answers
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 py-3 font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg active:scale-95"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Submitting...
              </>
            ) : (
              "Yes, Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Exam Page ───────────────────────────────────────────────────
const ExamPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [tabWarning, setTabWarning] = useState(false);

  const {
    // State
    attemptId,
    examTitle,
    questions,
    currentIndex,
    currentQuestion,
    answers,
    answeredCount,
    isLastQuestion,
    isFirstQuestion,
    isLoading,
    isSubmitting,
    error,
    formattedTime,
    isTimeWarning,
    isCriticalTime,
    remainingSeconds,

    // Actions
    selectAnswer,
    submitExam,
    startTimer,
    setupAntiCheat,
    goToNext,
    goToPrev,
    goToQuestion,
  } = useExamAttempt();

  // Agar store mein attempt nahi toh rules page pe redirect
  useEffect(() => {
    if (!attemptId && !isLoading) {
      navigate(`/student/exam/${examId}/rules`, { replace: true });
    }
  }, [attemptId, isLoading, examId, navigate]);

  // Start countdown timer
  useEffect(() => {
    if (attemptId) {
      startTimer();
    }
  }, [attemptId]);

  // Anti-cheat setup
  useEffect(() => {
    const cleanup = setupAntiCheat();

    // Tab switch warning
    const handleVisibility = () => {
      if (document.hidden) {
        setTabWarning(true);
        setTimeout(() => setTabWarning(false), 4000);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cleanup();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [setupAntiCheat]);

  // Block browser back/forward during exam
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSubmitConfirm = useCallback(() => {
    setShowSubmitModal(false);
    submitExam();
  }, [submitExam]);

  if (isLoading || !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="h-10 w-10 animate-spin text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <p className="text-gray-500">Loading exam...</p>
        </div>
      </div>
    );
  }

  const progressPct = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gray-50 select-none">
      {/* ── Tab Switch Warning Banner ── */}
      {tabWarning && (
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-red-600 py-2 text-sm font-semibold text-white">
          <FaExclamationTriangle />
          Warning: Tab switching detected. This activity is being monitored.
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* TOP HEADER BAR */}
      {/* ══════════════════════════════════════════════════════ */}
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
        {/* Exam Title */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 to-emerald-500" />
          <div>
            <p className="text-xs text-gray-400">MAT TEST — Matnite Infotech</p>
            <h1 className="text-sm font-bold text-gray-800 lg:text-base">
              {examTitle}
            </h1>
          </div>
        </div>

        {/* Timer + Progress */}
        <div className="flex items-center gap-4">
          {/* Question Progress */}
          <span className="hidden text-sm text-gray-500 sm:block">
            Question{" "}
            <span className="font-bold text-gray-800">{currentIndex + 1}</span>{" "}
            of{" "}
            <span className="font-bold text-gray-800">{questions.length}</span>
          </span>

          {/* Timer */}
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-lg font-bold transition-all ${
              isCriticalTime
                ? "animate-pulse bg-red-100 text-red-600"
                : isTimeWarning
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            <FaClock
              size={16}
              className={
                isCriticalTime
                  ? "text-red-500"
                  : isTimeWarning
                    ? "text-orange-500"
                    : "text-gray-500"
              }
            />
            {formattedTime}
          </div>

          {/* Submit Button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-md"
          >
            <FaFlag size={12} />
            <span className="hidden sm:block">Submit Exam</span>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════ */}
      {/* ATTEMPT PROGRESS BAR + QUESTION BUBBLES */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="border-b border-gray-200 bg-white px-6 py-3">
        {/* Progress Bar */}
        <div className="mb-3 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
            {answeredCount}/{questions.length} answered
          </span>
        </div>

        {/* Question Number Bubbles */}
        <div className="flex flex-wrap gap-2">
          {questions.map((q, i) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = i === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(i)}
                title={`Question ${i + 1}${isAnswered ? " (Answered)" : " (Not Answered)"}`}
                className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-md scale-110"
                    : isAnswered
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* MAIN QUESTION AREA */}
      {/* ══════════════════════════════════════════════════════ */}
      <main className="flex h-[calc(100vh-13.5rem)] flex-col overflow-y-auto p-6">
        <div className="mx-auto w-full max-w-3xl flex-1">
          {/* Error Banner */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              <FaExclamationTriangle />
              {error}
            </div>
          )}

          {/* Question Card */}
          <div className="mb-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
            {/* Question Header */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 text-xs font-bold text-white">
                  {currentIndex + 1}
                </span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  {currentQuestion.category}
                </span>
              </div>
              {answers[currentQuestion.id] !== undefined && (
                <FaCheckCircle
                  className="flex-shrink-0 text-emerald-500"
                  size={18}
                />
              )}
            </div>

            {/* Question Text */}
            <p className="text-lg font-semibold leading-relaxed text-gray-800">
              {currentQuestion.text}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentQuestion.id] === option.id;
              const optionLabel = ["A", "B", "C", "D"][idx] ?? idx + 1;

              return (
                <button
                  key={option.id}
                  onClick={() => selectAnswer(currentQuestion.id, option.id)}
                  className={`w-full rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        isSelected
                          ? "bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {optionLabel}
                    </span>
                    <span
                      className={`text-base font-medium ${
                        isSelected ? "text-blue-800" : "text-gray-700"
                      }`}
                    >
                      {option.text}
                    </span>
                    {isSelected && (
                      <FaCheckCircle
                        className="ml-auto flex-shrink-0 text-blue-500"
                        size={16}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════ */}
      {/* BOTTOM NAVIGATION BAR */}
      {/* ══════════════════════════════════════════════════════ */}
      <footer className="flex h-[3.5rem] items-center justify-between border-t border-gray-200 bg-white px-6 shadow-sm">
        <button
          onClick={goToPrev}
          disabled={isFirstQuestion}
          className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
            isFirstQuestion
              ? "cursor-not-allowed text-gray-300"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FaChevronLeft size={12} />
          Previous
        </button>

        {/* Center: Skip indicator */}
        {answers[currentQuestion.id] === undefined && (
          <span className="text-xs text-gray-400">Not answered</span>
        )}
        {answers[currentQuestion.id] !== undefined && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-500">
            <FaCheckCircle size={12} />
            Answered
          </span>
        )}

        {isLastQuestion ? (
          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-md"
          >
            Submit Exam
            <FaFlag size={12} />
          </button>
        ) : (
          <button
            onClick={goToNext}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-md"
          >
            Next
            <FaChevronRight size={12} />
          </button>
        )}
      </footer>

      {/* Submit Modal */}
      {showSubmitModal && (
        <SubmitModal
          answeredCount={answeredCount}
          totalCount={questions.length}
          onConfirm={handleSubmitConfirm}
          onCancel={() => setShowSubmitModal(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default ExamPage;
