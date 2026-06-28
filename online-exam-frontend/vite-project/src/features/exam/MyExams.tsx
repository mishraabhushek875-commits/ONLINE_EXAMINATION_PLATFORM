import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FaClock,
  FaTrophy,
  FaPlay,
  FaChartBar,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
import api from "../../services/api";
import type { AssignedExam, DashboardData } from "../../types/exam.types";

const MyExams = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["studentDashboard"],
    queryFn: async (): Promise<DashboardData> => {
      const { data } = await api.get("/student/dashboard");
      return data.data;
    },
  });

  const exams: AssignedExam[] = data?.assignedExams ?? [];

  const handleAction = (assignment: AssignedExam) => {
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

  if (error) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-8">
        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-red-500/15 blur-[140px]" />
        <div className="z-10 rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xl">
          <p className="font-medium text-red-600">Failed to load exams</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 p-8">
      {/* Background blobs - same palette as Register page */}
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[140px]" />
      <div className="absolute top-20 -right-32 h-[350px] w-[350px] rounded-full bg-emerald-500/20 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-orange-500/15 blur-[140px]" />
      <div className="absolute bottom-20 right-1/4 h-[250px] w-[250px] rounded-full bg-red-500/15 blur-[120px]" />
      <div className="absolute top-1/2 left-[8%] h-[220px] w-[220px] rounded-full bg-purple-500/15 blur-[110px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">
            My{" "}
            <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 bg-clip-text text-transparent">
              Exams
            </span>
          </h1>
          <p className="mt-2 font-medium text-gray-500">
            View all your assigned and completed exams.
          </p>
        </div>

        {/* Empty State */}
        {exams.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white/80 p-16 text-center shadow-sm backdrop-blur-sm">
            <div className="mx-auto mb-4 w-fit rounded-full border-2 border-purple-200 bg-purple-50 p-5">
              <MdAssignment className="text-purple-400" size={40} />
            </div>
            <p className="font-medium text-gray-400">No exams assigned yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {exams.map((assignment) => {
              const { exam, attemptStatus, score, passed } = assignment;

              const statusMap = {
                not_started: {
                  label: "Not Started",
                  cls: "bg-gray-100 text-gray-500",
                  icon: <FaHourglassHalf size={12} />,
                },
                in_progress: {
                  label: "In Progress",
                  cls: "bg-blue-100 text-blue-600",
                  icon: <FaPlay size={11} />,
                },
                submitted: {
                  label: passed ? "Passed" : "Failed",
                  cls: passed
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500",
                  icon: passed ? (
                    <FaCheckCircle size={12} />
                  ) : (
                    <FaTimesCircle size={12} />
                  ),
                },
                expired: {
                  label: "Expired",
                  cls: "bg-orange-100 text-orange-600",
                  icon: <FaHourglassHalf size={12} />,
                },
              };

              const status = statusMap[attemptStatus] ?? statusMap.not_started;
              const isSubmitted = attemptStatus === "submitted";
              const isExpired = attemptStatus === "expired";

              return (
                <div
                  key={assignment.assignmentId}
                  className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Status Badge + icon chip */}
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${status.cls}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                    <div className="rounded-full bg-gradient-to-br from-blue-100 via-emerald-50 to-orange-100 p-2.5">
                      <MdAssignment className="text-gray-500" size={16} />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-semibold text-gray-800">
                    {exam.title}
                  </h2>
                  {exam.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {exam.description}
                    </p>
                  )}

                  {/* Info Grid */}
                  <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="flex items-center gap-2 font-semibold text-gray-700">
                        <FaClock className="text-orange-500" />
                        {exam.duration} min
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Marks</p>
                      <p className="flex items-center gap-2 font-semibold text-gray-700">
                        <FaTrophy className="text-blue-500" />
                        {exam.totalMarks}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pass Marks</p>
                      <p className="font-semibold text-gray-700">
                        {exam.passingMarks}
                      </p>
                    </div>
                    {isSubmitted && (
                      <div>
                        <p className="text-xs text-gray-500">Your Score</p>
                        <p
                          className={`font-bold ${passed ? "text-green-600" : "text-red-500"}`}
                        >
                          {score}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => !isExpired && handleAction(assignment)}
                    disabled={isExpired}
                    className={`mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 font-semibold transition ${
                      isExpired
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : isSubmitted
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 text-white hover:scale-[1.02] hover:shadow-md"
                    }`}
                  >
                    {isSubmitted ? (
                      <>
                        <FaChartBar size={14} /> View Result
                      </>
                    ) : (
                      <>
                        <FaPlay size={12} />
                        {attemptStatus === "in_progress"
                          ? "Resume Exam"
                          : "Start Exam"}
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 bg-clip-text font-semibold text-transparent">
            Matnite Infotech
          </span>
          . All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default MyExams;
