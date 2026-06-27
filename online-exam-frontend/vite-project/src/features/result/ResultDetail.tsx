import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ImCheckmark, ImCross } from "react-icons/im";
import { LuNotepadText } from "react-icons/lu";

interface OptionItem {
  id: number;
  text: string;
}

interface QuestionReview {
  question_text: string;
  options?: OptionItem[];
  selected_option_id: number | null;
  correct_option_id: number | undefined;
  is_correct: boolean;
}

interface ResultDetailData {
  attempt_id: number;
  exam_title: string;
  score: number;
  total_marks: number;
  passed: boolean;
  submitted_at: string | null;
  questions: QuestionReview[];
}

// 👉 set VITE_API_URL in your .env, falls back to localhost for dev
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ResultDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [result, setResult] = useState<ResultDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      setError("");
      try {
        // 👉 adjust this if you're storing the token somewhere else (e.g. a zustand store)
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${API_BASE}/api/results/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.message || "Result not found");
        }

        const data: ResultDetailData = await res.json();
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchResult();
  }, [id]);

  // ─── Loading State ───────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  // ─── Error State ──────────────────────────────
  if (error || !result) {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-xl rounded-xl border border-red-400 bg-red-100 p-8 text-center">
          <h2 className="text-lg font-semibold text-red-600">
            {error || "Result not found"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            This result either doesn&apos;t exist or you don&apos;t have access
            to it.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-5 rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 px-5 py-2 font-semibold text-white transition hover:scale-[1.02]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const percentage =
    result.total_marks > 0
      ? Math.round((result.score / result.total_marks) * 100)
      : 0;

  const correctCount = result.questions.filter((q) => q.is_correct).length;
  const incorrectCount = result.questions.length - correctCount;

  return (
    <div className="p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
          >
            <FaArrowLeft size={12} /> Back to results
          </button>

          <h1 className="text-3xl font-bold">{result.exam_title}</h1>

          <p className="mt-1 text-gray-600">
            Submitted on{" "}
            {result.submitted_at
              ? new Date(result.submitted_at).toLocaleString()
              : "—"}
          </p>
        </div>

        {/* Summary Card */}
        <div
          className={`mb-10 rounded-2xl border p-6 ${
            result.passed
              ? "border-green-400 bg-green-100"
              : "border-red-400 bg-red-100"
          }`}
        >
          <h2 className="mb-6 text-center text-xl font-semibold">
            Result Summary
          </h2>

          <div className="flex flex-col gap-6 rounded-xl bg-white p-5 sm:flex-row">
            {/* Left Status */}
            <div className="flex flex-col items-center justify-center border-b border-gray-200 pb-6 sm:w-1/3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6">
              <div
                className={`flex h-24 w-24 items-center justify-center rounded-2xl border ${
                  result.passed
                    ? "border-green-500 bg-green-100"
                    : "border-red-500 bg-red-100"
                }`}
              >
                {result.passed ? (
                  <ImCheckmark className="text-green-500" size={40} />
                ) : (
                  <ImCross className="text-red-500" size={40} />
                )}
              </div>

              <span
                className={`mt-4 rounded-full px-4 py-1 font-semibold ${
                  result.passed
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {result.passed ? "Passed" : "Failed"}
              </span>
            </div>

            {/* Right Details */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-gray-500">Total Marks</p>
                  <p className="font-semibold">{result.total_marks}</p>
                </div>

                <div>
                  <p className="text-gray-500">Obtained Marks</p>
                  <p
                    className={`font-semibold ${
                      result.passed ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.score}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Percentage</p>
                  <p
                    className={`font-semibold ${
                      result.passed ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {percentage}%
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Questions</p>
                  <p className="font-semibold">{result.questions.length}</p>
                </div>

                <div>
                  <p className="text-gray-500">Correct</p>
                  <p className="font-semibold text-green-600">{correctCount}</p>
                </div>

                <div>
                  <p className="text-gray-500">Incorrect</p>
                  <p className="font-semibold text-red-600">{incorrectCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question-wise Review */}
        <div className="mb-6 flex items-center gap-2">
          <LuNotepadText className="text-blue-500" size={22} />
          <h2 className="text-xl font-bold">Question-wise Review</h2>
        </div>

        <div className="flex flex-col gap-4">
          {result.questions.map((q, index) => (
            <div
              key={index}
              className={`rounded-xl border bg-white p-5 ${
                q.is_correct ? "border-green-300" : "border-red-300"
              }`}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <p className="font-semibold text-gray-800">
                  <span className="mr-2 text-gray-400">Q{index + 1}.</span>
                  {q.question_text}
                </p>

                {q.is_correct ? (
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                    <FaCheckCircle /> Correct
                  </span>
                ) : (
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                    <FaTimesCircle /> Incorrect
                  </span>
                )}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {q.options?.map((opt) => {
                  const isSelected = opt.id === q.selected_option_id;
                  const isCorrectOption = opt.id === q.correct_option_id;

                  let style = "border-gray-200 bg-gray-50 text-gray-700";
                  if (isCorrectOption) {
                    style = "border-green-400 bg-green-50 text-green-700";
                  } else if (isSelected && !isCorrectOption) {
                    style = "border-red-400 bg-red-50 text-red-700";
                  }

                  return (
                    <div
                      key={opt.id}
                      className={`flex items-center justify-between rounded-lg border px-4 py-2 text-sm ${style}`}
                    >
                      <span>{opt.text}</span>

                      {isSelected && (
                        <span className="ml-2 text-xs font-semibold uppercase opacity-70">
                          Your answer
                        </span>
                      )}

                      {isCorrectOption && !isSelected && (
                        <span className="ml-2 text-xs font-semibold uppercase opacity-70">
                          Correct answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultDetail;
