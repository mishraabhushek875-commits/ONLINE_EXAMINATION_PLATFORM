// src/features/exam/ExamDetail.tsx
// Real data — AssignedExam type se, dashboard API se aata hai

import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaClock,
  FaClipboardList,
  FaTrophy,
  FaCheckCircle,
  FaPlayCircle,
  FaChartBar,
  FaHourglassHalf,
} from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import type { DashboardData, AssignedExam } from "../../types/exam.types";

const ExamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Dashboard se saara data aata hai — same query key, cache hit hoga
  const { data, isLoading, error } = useQuery({
    queryKey: ["studentDashboard"],
    queryFn: async (): Promise<DashboardData> => {
      const { data } = await api.get("/student/dashboard");
      return data.data;
    },
  });

  // Is exam ki assignment dhoondo
  const assignment: AssignedExam | undefined = data?.assignedExams.find(
    (a) => a.exam.id === parseInt(id!),
  );

  const handleAction = () => {
    if (!assignment) return;
    if (assignment.attemptStatus === "submitted") {
      navigate(`/result/${assignment.attemptId}`);
    } else {
      navigate(`/student/exam/${assignment.exam.id}/rules`, {
        state: {
          examTitle: assignment.exam.title,
          duration: assignment.exam.duration,
          totalMarks: assignment.exam.totalMarks,
          passingMarks: assignment.exam.passingMarks,
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[140px]" />
        <div className="absolute top-20 -right-32 h-[350px] w-[350px] rounded-full bg-emerald-500/20 blur-[140px]" />
        <div className="z-10 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-8">
        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-red-500/15 blur-[140px]" />
        <div className="z-10 rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xl">
          <p className="font-medium text-red-600">
            Exam not found or not assigned to you.
          </p>
          <button
            onClick={() => navigate("/my-exams")}
            className="mt-4 rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 px-6 py-2 font-semibold text-white"
          >
            Back to My Exams
          </button>
        </div>
      </div>
    );
  }

  const { exam, attemptStatus, score, passed, submittedAt } = assignment;
  const isSubmitted = attemptStatus === "submitted";
  const isExpired = attemptStatus === "expired";
  const isInProgress = attemptStatus === "in_progress";

  const statusMap = {
    not_started: { label: "Not Started", cls: "bg-gray-100 text-gray-500" },
    in_progress: { label: "In Progress", cls: "bg-blue-100 text-blue-600" },
    submitted: {
      label: passed ? "Passed" : "Failed",
      cls: passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500",
    },
    expired: { label: "Expired", cls: "bg-orange-100 text-orange-600" },
  };
  const status = statusMap[attemptStatus] ?? statusMap.not_started;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 p-8">
      {/* Background blobs */}
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[140px]" />
      <div className="absolute top-20 -right-32 h-[350px] w-[350px] rounded-full bg-emerald-500/20 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-orange-500/15 blur-[140px]" />
      <div className="absolute bottom-20 right-1/4 h-[250px] w-[250px] rounded-full bg-red-500/15 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Back */}
        <button
          onClick={() => navigate("/my-exams")}
          className="mb-6 inline-flex items-center gap-2 font-medium text-gray-500 transition hover:text-blue-600"
        >
          <FaArrowLeft size={13} /> Back to My Exams
        </button>

        {/* Header Card */}
        <div className="mb-6 rounded-3xl border border-white bg-white/80 p-8 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-blue-100 via-emerald-50 to-orange-100 p-4">
                <MdAssignment className="text-gray-600" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {exam.title}
                </h1>
                {exam.description && (
                  <p className="mt-2 max-w-xl text-gray-500">
                    {exam.description}
                  </p>
                )}
              </div>
            </div>
            <span
              className={`flex-shrink-0 self-start rounded-full px-4 py-1.5 text-sm font-semibold ${status.cls}`}
            >
              {status.label}
            </span>
          </div>

          {/* Submitted info */}
          {isSubmitted && submittedAt && (
            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
              Submitted on{" "}
              <span className="font-semibold text-gray-700">
                {new Date(submittedAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div
          className={`mb-6 grid gap-5 ${isSubmitted ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-3"}`}
        >
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-center">
            <FaClock className="mx-auto mb-3 text-orange-500" size={28} />
            <p className="text-sm text-gray-500">Duration</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {exam.duration} Min
            </h2>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-center">
            <FaTrophy className="mx-auto mb-3 text-blue-500" size={28} />
            <p className="text-sm text-gray-500">Total Marks</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {exam.totalMarks}
            </h2>
          </div>

          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 text-center">
            <FaCheckCircle className="mx-auto mb-3 text-purple-500" size={28} />
            <p className="text-sm text-gray-500">Passing Marks</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {exam.passingMarks}
            </h2>
          </div>

          {isSubmitted && (
            <div
              className={`rounded-2xl border p-5 text-center ${passed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
            >
              <FaChartBar
                className={`mx-auto mb-3 ${passed ? "text-green-500" : "text-red-500"}`}
                size={28}
              />
              <p className="text-sm text-gray-500">Your Score</p>
              <h2
                className={`text-2xl font-bold ${passed ? "text-green-600" : "text-red-500"}`}
              >
                {score}
              </h2>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mb-8 rounded-3xl border border-white bg-white/80 p-8 shadow-xl backdrop-blur-xl">
          <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-gray-800">
            <FaClipboardList className="text-blue-500" />
            Instructions
          </h2>
          <ul className="space-y-3 text-gray-600">
            {[
              `Total duration of the examination is ${exam.duration} minutes.`,
              "There are multiple-choice questions — select the best answer.",
              "Each question carries equal marks.",
              "No negative marking.",
              "You cannot pause the examination once started.",
              "Make sure you have a stable internet connection.",
              "Do not switch tabs, refresh or close the browser window.",
              `Click "Submit Exam" before the timer ends. Auto-submit will happen if time runs out.`,
            ].map((inst, i) => (
              <li key={i} className="flex items-start gap-3">
                <FaCheckCircle
                  className="mt-0.5 flex-shrink-0 text-emerald-500"
                  size={14}
                />
                <span>{inst}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          {isExpired ? (
            <button
              disabled
              className="flex cursor-not-allowed items-center gap-3 rounded-xl bg-gray-200 px-8 py-4 font-semibold text-gray-400"
            >
              <FaHourglassHalf /> Expired
            </button>
          ) : isSubmitted ? (
            <button
              onClick={handleAction}
              className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 px-8 py-4 font-semibold text-white transition hover:scale-[1.02] hover:shadow-xl"
            >
              <FaChartBar size={18} /> View Result
            </button>
          ) : (
            <button
              onClick={handleAction}
              className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 px-8 py-4 font-semibold text-white transition hover:scale-[1.02] hover:shadow-xl active:scale-95"
            >
              <FaPlayCircle size={20} />
              {isInProgress ? "Resume Exam" : "Start Exam"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamDetail;
