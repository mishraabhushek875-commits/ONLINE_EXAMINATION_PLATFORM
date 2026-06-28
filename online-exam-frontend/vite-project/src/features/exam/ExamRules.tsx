// src/features/exam/ExamRules.tsx

import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  FaShieldAlt,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaLaptop,
  FaEye,
} from "react-icons/fa";
import { MdQuiz, MdOutlineVerifiedUser } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";
import { useExamAttempt } from "../../hooks/useExamAttempt";

const rules = [
  {
    icon: <FaClock size={18} />,
    color: "text-blue-500",
    bg: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100",
    title: "Time Limit",
    desc: "The exam has a fixed duration. Once the timer starts, it cannot be paused. The exam will auto-submit when time runs out.",
  },
  {
    icon: <FaLaptop size={18} />,
    color: "text-emerald-500",
    bg: "bg-emerald-50 border-emerald-200",
    iconBg: "bg-emerald-100",
    title: "Single Attempt",
    desc: "You are allowed only one attempt per exam. Once submitted, you cannot retake the exam.",
  },
  {
    icon: <FaEye size={18} />,
    color: "text-orange-500",
    bg: "bg-orange-50 border-orange-200",
    iconBg: "bg-orange-100",
    title: "No Tab Switching",
    desc: "Do not switch tabs, minimize the browser, or navigate away. Any such activity will be flagged.",
  },
  {
    icon: <FaShieldAlt size={18} />,
    color: "text-purple-500",
    bg: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100",
    title: "No External Help",
    desc: "You must not use any external resources, search engines, or assistance during the exam.",
  },
  {
    icon: <MdQuiz size={20} />,
    color: "text-red-500",
    bg: "bg-red-50 border-red-200",
    iconBg: "bg-red-100",
    title: "Answer Navigation",
    desc: "You can navigate between questions freely. Unanswered questions will be marked as skipped.",
  },
  {
    icon: <MdOutlineVerifiedUser size={20} />,
    color: "text-indigo-500",
    bg: "bg-indigo-50 border-indigo-200",
    iconBg: "bg-indigo-100",
    title: "Auto-Save",
    desc: "Your answers are automatically saved as you proceed. Progress is retained in case of a connection issue.",
  },
];

const ExamRules = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { examId } = useParams<{ examId: string }>();
  const [checked, setChecked] = useState(false);
  const [starting, setStarting] = useState(false);

  const { startExam, error } = useExamAttempt();

  const examInfo = location.state as {
    examTitle?: string;
    duration?: number;
    totalMarks?: number;
    passingMarks?: number;
  } | null;

  useEffect(() => {
    if (!examId) navigate("/");
  }, [examId, navigate]);

  const handleStartExam = async () => {
    if (!checked || !examId) return;
    setStarting(true);
    try {
      await startExam(parseInt(examId));
      navigate(`/student/exam/${examId}/attempt`, { replace: true });
    } catch {
      setStarting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[140px]" />
      <div className="absolute top-20 -right-32 h-[350px] w-[350px] rounded-full bg-emerald-500/20 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-orange-500/15 blur-[140px]" />
      <div className="absolute bottom-20 right-1/4 h-[250px] w-[250px] rounded-full bg-red-500/15 blur-[120px]" />
      <div className="absolute top-32 left-1/2 h-[250px] w-[250px] rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-12">
        {/* ── Top Header ───────────────────────────────────── */}
        <div className="mb-8 rounded-3xl border border-white bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 shadow-lg">
              <IoWarningOutline className="text-white" size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">
                You are about to start
              </p>
              <h1 className="text-2xl font-bold text-gray-800">
                {examInfo?.examTitle ?? "Exam"}
              </h1>
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 text-center">
              <div className="absolute -top-3 -right-3 h-12 w-12 rounded-full bg-blue-200/40" />
              <FaClock className="mx-auto mb-2 text-blue-400" size={20} />
              <p className="text-2xl font-bold text-blue-600">
                {examInfo?.duration ?? "--"}
              </p>
              <p className="text-xs font-medium text-blue-400">Minutes</p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 text-center">
              <div className="absolute -top-3 -right-3 h-12 w-12 rounded-full bg-emerald-200/40" />
              <MdQuiz className="mx-auto mb-2 text-emerald-400" size={22} />
              <p className="text-2xl font-bold text-emerald-600">
                {examInfo?.totalMarks ?? "--"}
              </p>
              <p className="text-xs font-medium text-emerald-400">
                Total Marks
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 p-4 text-center">
              <div className="absolute -top-3 -right-3 h-12 w-12 rounded-full bg-orange-200/40" />
              <FaCheckCircle
                className="mx-auto mb-2 text-orange-400"
                size={18}
              />
              <p className="text-2xl font-bold text-orange-600">
                {examInfo?.passingMarks ?? "--"}
              </p>
              <p className="text-xs font-medium text-orange-400">
                Passing Marks
              </p>
            </div>
          </div>
        </div>

        {/* ── Rules ───────────────────────────────────────── */}
        <div className="mb-8 rounded-3xl border border-white bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-6 flex items-center gap-2.5 text-xl font-bold text-gray-800">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
              <FaExclamationTriangle className="text-orange-500" size={14} />
            </span>
            Rules & Regulations
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {rules.map((rule, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-2xl border p-4 transition hover:shadow-sm ${rule.bg}`}
              >
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${rule.iconBg} ${rule.color}`}
                >
                  {rule.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {rule.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                    {rule.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Agreement + CTA ──────────────────────────────── */}
        <div className="rounded-3xl border border-white bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <FaExclamationTriangle size={13} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Checkbox agreement */}
          <label
            className={`mb-6 flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition ${checked ? "border-blue-400 bg-blue-50/60" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}
          >
            <div className="mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="h-5 w-5 cursor-pointer accent-blue-600"
              />
            </div>
            <span className="text-sm leading-relaxed text-gray-600">
              I have read and understood all the rules and regulations. I agree
              to abide by them during the examination. I acknowledge that any
              violation may result in{" "}
              <span className="font-semibold text-red-500">
                disqualification
              </span>
              .
            </span>
          </label>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 rounded-xl border-2 border-gray-200 py-3 font-semibold text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleStartExam}
              disabled={!checked || starting}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition duration-300 ${
                checked && !starting
                  ? "bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 hover:scale-[1.02] hover:shadow-xl active:scale-95"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              }`}
            >
              {starting ? (
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
                  Starting Exam...
                </>
              ) : (
                <>
                  <FaCheckCircle size={15} />
                  Start Exam
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <footer className="pb-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()}{" "}
        <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 bg-clip-text font-semibold text-transparent">
          Matnite Infotech
        </span>
        . All rights reserved.
      </footer>
    </div>
  );
};

export default ExamRules;
