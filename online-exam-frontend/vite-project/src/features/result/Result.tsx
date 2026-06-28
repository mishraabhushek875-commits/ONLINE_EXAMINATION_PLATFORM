import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaCalendarAlt,
  FaArrowRight,
} from "react-icons/fa";
import resultService from "../../services/result";
import type { MyResultItem } from "../../types/dashboard.types";

const Results = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["myResults"],
    queryFn: resultService.getMyResults,
  });

  const results: MyResultItem[] = data?.results ?? [];

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
          <FaTimesCircle className="mx-auto mb-3 text-red-400" size={36} />
          <p className="font-medium text-red-600">Failed to load results</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 p-8">
      {/* Background blobs - same palette across all pages */}
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
              Results
            </span>
          </h1>
          <p className="mt-2 font-medium text-gray-500">
            View all submitted examination results.
          </p>
        </div>

        {/* Empty State */}
        {results.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white/80 p-16 text-center shadow-sm backdrop-blur-sm">
            <div className="mx-auto mb-4 w-fit rounded-full border-2 border-purple-200 bg-purple-50 p-5">
              <FaTrophy className="text-purple-400" size={36} />
            </div>
            <p className="font-medium text-gray-400">No results yet.</p>
            <p className="mt-1 text-sm text-gray-400">
              Complete an exam to see your results here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {results.map((result) => {
              const percentage = Math.round(
                (result.score / result.total_marks) * 100,
              );

              return (
                <div
                  key={result.attempt_id}
                  className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {result.exam_title}
                    </h2>
                    {result.passed ? (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-600">
                        <FaCheckCircle size={12} /> Passed
                      </span>
                    ) : (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                        <FaTimesCircle size={12} /> Failed
                      </span>
                    )}
                  </div>

                  {/* Score grid - grouped like exam info card */}
                  <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                      <div className="mb-2 inline-flex rounded-full bg-blue-100 p-2">
                        <FaTrophy className="text-blue-500" size={16} />
                      </div>
                      <p className="text-xs text-gray-500">Score</p>
                      <h3 className="text-xl font-bold text-gray-800">
                        {result.score}/{result.total_marks}
                      </h3>
                    </div>
                    <div
                      className={`rounded-xl p-4 shadow-sm ${
                        result.passed ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      <p className="text-xs text-gray-500">Percentage</p>
                      <h3
                        className={`mt-1 text-xl font-bold ${
                          result.passed ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {percentage}%
                      </h3>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="mt-5 flex items-center gap-2 text-gray-500">
                    <FaCalendarAlt className="text-orange-500" />
                    <span className="text-sm">
                      {result.submitted_at
                        ? new Date(result.submitted_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </span>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => navigate(`/result/${result.attempt_id}`)}
                    className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 py-3 font-semibold text-white transition hover:scale-[1.02] hover:shadow-md"
                  >
                    View Result <FaArrowRight />
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

export default Results;
