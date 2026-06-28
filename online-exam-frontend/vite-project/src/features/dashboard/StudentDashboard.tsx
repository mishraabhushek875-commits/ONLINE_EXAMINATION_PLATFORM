import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaCheckCircle,
  FaTrophy,
  FaPlay,
  FaChartBar,
  FaTimesCircle,
  FaHistory,
} from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
import { useStudentDashboard } from "../../hooks/useStudentDashboard";
import type {
  AssignedExam,
  LatestResult,
  SubmitExamResponse,
} from "../../types/exam.types";

const StatCard = ({
  icon,
  label,
  value,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  gradient: string;
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur-xl">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`rounded-xl p-3 ${gradient}`}>{icon}</div>
    </div>
  </div>
);

const LatestResultBanner = ({
  result,
}: {
  result: SubmitExamResponse | LatestResult;
}) => {
  const score = result.score;
  const totalMarks = result.totalMarks;
  const passed = result.passed;
  const pct = Math.round((score / totalMarks) * 100);

  return (
    <div
      className={`mb-6 rounded-3xl border p-6 shadow-sm backdrop-blur-xl ${
        passed
          ? "border-emerald-200 bg-emerald-50/80"
          : "border-red-200 bg-red-50/80"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <div
          className={`rounded-full p-1.5 ${passed ? "bg-emerald-100" : "bg-red-100"}`}
        >
          {passed ? (
            <FaTrophy className="text-emerald-500" size={18} />
          ) : (
            <FaTimesCircle className="text-red-400" size={18} />
          )}
        </div>
        <p className="text-sm font-semibold text-gray-500">
          Latest <span className="text-orange-500">Result</span>
        </p>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {"examTitle" in result ? result.examTitle : "Exam"}
          </h3>
          <p
            className={`mt-1 text-sm font-medium ${passed ? "text-emerald-600" : "text-red-500"}`}
          >
            {passed ? "✓ Passed" : "✗ Did not pass"} — {score}/{totalMarks}{" "}
            marks ({pct}%)
          </p>
        </div>
        <div className="relative flex-shrink-0">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke={passed ? "#10b981" : "#ef4444"}
              strokeWidth="3"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeLinecap="round"
            />
          </svg>
          <span
            className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${passed ? "text-emerald-600" : "text-red-500"}`}
          >
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
};

const ExamCard = ({
  assignment,
  onStart,
}: {
  assignment: AssignedExam;
  onStart: (assignment: AssignedExam) => void;
}) => {
  const { exam, attemptStatus, score, passed } = assignment;

  const statusConfig = {
    not_started: {
      badge: "Not Started",
      badgeCls: "bg-gray-100 text-gray-500",
      btnLabel: "Start Exam",
      btnCls:
        "bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 text-white hover:scale-[1.02] hover:shadow-lg",
      icon: <FaPlay size={11} />,
    },
    in_progress: {
      badge: "In Progress",
      badgeCls: "bg-blue-100 text-blue-600",
      btnLabel: "Resume Exam",
      btnCls:
        "bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:scale-[1.02] hover:shadow-lg",
      icon: <FaPlay size={11} />,
    },
    submitted: {
      badge: passed ? "Passed" : "Failed",
      badgeCls: passed
        ? "bg-emerald-100 text-emerald-600"
        : "bg-red-100 text-red-500",
      btnLabel: "View Result",
      btnCls: "border border-gray-200 text-gray-600 hover:bg-gray-50",
      icon: <FaChartBar size={12} />,
    },
    expired: {
      badge: "Expired",
      badgeCls: "bg-orange-100 text-orange-600",
      btnLabel: "Expired",
      btnCls: "cursor-not-allowed bg-gray-100 text-gray-400",
      icon: null,
    },
  };

  const config = statusConfig[attemptStatus] ?? statusConfig.not_started;

  return (
    <div className="rounded-3xl border border-white bg-white/80 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-lg hover:shadow-green-400 transition-all duration-1000 shadow-orange-400 ">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="font-bold  text-2xl ">{exam.title}</h3>
        <span
          className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${config.badgeCls}`}
        >
          {config.badge}
        </span>
      </div>

      {exam.description && (
        <p className="mb-4 line-clamp-2 text-sm text-gray-500">
          {exam.description}
        </p>
      )}

      <div className="mb-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-blue-50 p-3 text-center">
          <p className="text-base font-bold text-blue-600">{exam.duration}m</p>
          <p className="text-xs text-gray-400">Duration</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3 text-center">
          <p className="text-base font-bold text-emerald-600">
            {exam.totalMarks}
          </p>
          <p className="text-xs text-gray-400">Total Marks</p>
        </div>
        <div className="rounded-xl bg-orange-50 p-3 text-center">
          {attemptStatus === "submitted" ? (
            <>
              <p
                className={`text-base font-bold ${passed ? "text-emerald-600" : "text-red-500"}`}
              >
                {score}
              </p>
              <p className="text-xs text-gray-400">Your Score</p>
            </>
          ) : (
            <>
              <p className="text-base font-bold text-orange-600">
                {exam.passingMarks}
              </p>
              <p className="text-xs text-gray-400">Pass Marks</p>
            </>
          )}
        </div>
      </div>

      <button
        onClick={() => onStart(assignment)}
        disabled={attemptStatus === "expired"}
        className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${config.btnCls}`}
      >
        <span className="flex items-center justify-center gap-2">
          {config.icon}
          {config.btnLabel}
        </span>
      </button>
    </div>
  );
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading, error, refetch } = useStudentDashboard();

  const freshResult = location.state as {
    latestResult?: SubmitExamResponse;
    fromExam?: boolean;
  } | null;

  const handleStartExam = (assignment: AssignedExam) => {
    if (assignment.attemptStatus === "submitted") {
      navigate(`/result/${assignment.attemptId}`);
      return;
    }
    navigate(`/student/exam/${assignment.exam.id}/rules`, {
      state: {
        examTitle: assignment.exam.title,
        duration: assignment.exam.duration,
        totalMarks: assignment.exam.totalMarks,
        passingMarks: assignment.exam.passingMarks,
      },
    });
  };

  if (isLoading) {
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
          <p className="text-gray-500">
            Loading your <span className="text-blue-500">dashboard</span>...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-md">
          <FaTimesCircle className="mx-auto mb-3 text-red-400" size={36} />
          <p className="mb-4 font-medium text-red-600">{error}</p>
          <button
            onClick={refetch}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-6 py-2 text-sm font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[140px]" />
      <div className="absolute top-20 -right-32 h-[350px] w-[350px] rounded-full bg-emerald-500/20 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-orange-500/15 blur-[140px]" />
      <div className="absolute bottom-20 right-1/4 h-[250px] w-[250px] rounded-full bg-red-500/15 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-orange-500">
            Welcome <span className=" text-gray-500">back,</span>
          </p>
          <h1 className="text-3xl font-bold ">
            {data?.student.full_name ?? "Student"} 👋
          </h1>
          <p className="text-gray-400">{data?.student.email}</p>
        </div>

        {freshResult?.fromExam && freshResult.latestResult && (
          <LatestResultBanner result={freshResult.latestResult} />
        )}

        <div className="mb-8 grid grid-cols-3 gap-4 ">
          <StatCard
            icon={<MdAssignment className="text-white" size={20} />}
            label="Assigned Exams"
            value={data?.stats.totalAssigned ?? 0}
            gradient="bg-blue-500"
          />
          <StatCard
            icon={<FaCheckCircle className="text-white" size={18} />}
            label="Completed"
            value={data?.stats.completed ?? 0}
            gradient="bg-emerald-500"
          />
          <StatCard
            icon={<FaTrophy className="text-white" size={18} />}
            label="Passed"
            value={data?.stats.passed ?? 0}
            gradient="bg-orange-500"
          />
        </div>

        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <FaBookOpen className="text-blue-500" />
            <h2 className="text-3xl font-bold ">
              Your <span className="text-blue-500">Exams</span>
            </h2>
          </div>

          {!data?.assignedExams.length ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white/60 p-12 text-center backdrop-blur-xl">
              <MdAssignment className="mx-auto mb-3 text-gray-300" size={48} />
              <p className="font-medium text-gray-700">
                No exams <span className="text-orange-500">assigned</span> yet.
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Check back later or contact your{" "}
                <span className="text-blue-500">administrator</span>.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {data.assignedExams.map((assignment) => (
                <ExamCard
                  key={assignment.assignmentId}
                  assignment={assignment}
                  onStart={handleStartExam}
                />
              ))}
            </div>
          )}
        </div>

        {(data?.latestResults?.length ?? 0) > 0 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <FaHistory className="text-purple-500" />
              <h2 className="text-3xl font-bold text-gray-800">
                Recent <span className="text-emerald-500">Results</span>
              </h2>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white bg-white/80 shadow-sm backdrop-blur-xl">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Exam
                    </th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-600">
                      Score
                    </th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-600">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data!.latestResults.map((r) => (
                    <tr
                      key={r.attemptId}
                      className="transition hover:bg-gray-50/80"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {r.examTitle}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-gray-700">
                          {r.score}
                        </span>
                        <span className="text-gray-400">/{r.totalMarks}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${r.passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}
                        >
                          {r.passed ? (
                            <FaCheckCircle size={10} />
                          ) : (
                            <FaTimesCircle size={10} />
                          )}
                          {r.passed ? "Passed" : "Failed"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-400">
                        {r.submittedAt
                          ? new Date(r.submittedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <footer className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 text-center text-sm text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">
          <span className="text-blue-600">Matnite</span>{" "}
          <span className="text-emerald-500">Info</span>
          <span className="text-orange-500">tech</span>
        </span>
        . All rights reserved.
      </footer>
    </div>
  );
};

export default StudentDashboard;
