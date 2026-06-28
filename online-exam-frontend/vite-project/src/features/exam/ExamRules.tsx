// src/features/exam/pages/ExamRules.tsx
// Exam shuru karne se pehle rules & regulations interceptor page

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
    icon: <FaClock className="text-blue-500" size={20} />,
    bg: "bg-blue-50 border-blue-200",
    title: "Time Limit",
    desc: "The exam has a fixed duration. Once the timer starts, it cannot be paused. The exam will auto-submit when time runs out.",
  },
  {
    icon: <FaLaptop className="text-emerald-500" size={20} />,
    bg: "bg-emerald-50 border-emerald-200",
    title: "Single Attempt",
    desc: "You are allowed only one attempt per exam. Once submitted, you cannot retake the exam.",
  },
  {
    icon: <FaEye className="text-orange-500" size={20} />,
    bg: "bg-orange-50 border-orange-200",
    title: "No Tab Switching",
    desc: "Do not switch tabs, minimize the browser, or navigate away. Any such activity will be flagged.",
  },
  {
    icon: <FaShieldAlt className="text-purple-500" size={20} />,
    bg: "bg-purple-50 border-purple-200",
    title: "No External Help",
    desc: "You must not use any external resources, search engines, or assistance during the exam. This is a test of your individual knowledge.",
  },
  {
    icon: <MdQuiz className="text-red-500" size={22} />,
    bg: "bg-red-50 border-red-200",
    title: "Answer Navigation",
    desc: "You can navigate between questions freely. Unanswered questions will be marked as skipped. Review all answers before submitting.",
  },
  {
    icon: <MdOutlineVerifiedUser className="text-indigo-500" size={22} />,
    bg: "bg-indigo-50 border-indigo-200",
    title: "Auto-Save",
    desc: "Your answers are automatically saved as you proceed. In case of a connection issue, your progress up to the last save will be retained.",
  },
];

const ExamRules = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { examId } = useParams<{ examId: string }>();
  const [checked, setChecked] = useState(false);
  const [starting, setStarting] = useState(false);

  const { startExam, error } = useExamAttempt();

  // Exam info passed via navigation state
  const examInfo = location.state as {
    examTitle?: string;
    duration?: number;
    totalMarks?: number;
    passingMarks?: number;
  } | null;

  // Block direct access without state
  useEffect(() => {
    if (!examId) navigate("/student/dashboard");
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
      {/* Background blobs — same as existing pages */}
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[140px]" />
      <div className="absolute top-20 -right-32 h-[350px] w-[350px] rounded-full bg-emerald-500/20 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-orange-500/15 blur-[140px]" />
      <div className="absolute bottom-20 right-1/4 h-[250px] w-[250px] rounded-full bg-red-500/15 blur-[120px]" />
      <div className="absolute top-32 left-1/2 h-[250px] w-[250px] rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6 pt-24">
        <div className="w-full max-w-2xl">
          {/* Header Card */}
          <div className="mb-6 rounded-3xl border border-white bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 p-3">
                <IoWarningOutline className="text-white" size={26} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  You are about to start
                </p>
                <h1 className="text-2xl font-bold text-gray-800">
                  {examInfo?.examTitle ?? "Exam"}
                </h1>
              </div>
            </div>

            {/* Exam Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-blue-50 p-3 text-center">
                <p className="text-xl font-bold text-blue-600">
                  {examInfo?.duration ?? "--"}
                </p>
                <p className="text-xs text-gray-500">Minutes</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-center">
                <p className="text-xl font-bold text-emerald-600">
                  {examInfo?.totalMarks ?? "--"}
                </p>
                <p className="text-xs text-gray-500">Total Marks</p>
              </div>
              <div className="rounded-2xl bg-orange-50 p-3 text-center">
                <p className="text-xl font-bold text-orange-600">
                  {examInfo?.passingMarks ?? "--"}
                </p>
                <p className="text-xs text-gray-500">Passing Marks</p>
              </div>
            </div>
          </div>

          {/* Rules Card */}
          <div className="mb-6 rounded-3xl border border-white bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-800">
              <FaExclamationTriangle className="text-orange-500" />
              Rules & Regulations
            </h2>

            <div className="space-y-4">
              {rules.map((rule, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-4 rounded-2xl border p-4 ${rule.bg}`}
                >
                  <div className="mt-0.5 flex-shrink-0">{rule.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-800">{rule.title}</p>
                    <p className="mt-1 text-sm text-gray-600">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agreement + CTA Card */}
          <div className="rounded-3xl border border-white bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <label className="mb-6 flex cursor-pointer items-start gap-3">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  className="h-5 w-5 cursor-pointer accent-blue-600"
                />
              </div>
              <span className="text-sm text-gray-700">
                I have read and understood all the rules and regulations. I
                agree to abide by them during the examination. I acknowledge
                that any violation may result in disqualification.
              </span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/student/dashboard")}
                className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-gray-600 transition duration-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStartExam}
                disabled={!checked || starting}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition duration-300 ${
                  checked && !starting
                    ? "bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 hover:scale-[1.02] hover:shadow-xl active:scale-95"
                    : "cursor-not-allowed bg-gray-300"
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
                    <FaCheckCircle />
                    Start Exam
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 text-center text-sm text-gray-500">
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
