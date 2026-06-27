import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaCalendarAlt,
  FaArrowRight,
} from "react-icons/fa";

const results = [
  {
    attempt_id: 1,
    exam_title: "Backend Fundamentals",
    score: 84,
    total_marks: 100,
    passed: true,
    submitted_at: "2026-06-20T10:30:00Z",
  },
  {
    attempt_id: 2,
    exam_title: "React Advanced",
    score: 34,
    total_marks: 100,
    passed: false,
    submitted_at: "2026-06-18T11:15:00Z",
  },
  {
    attempt_id: 3,
    exam_title: "Database Management",
    score: 91,
    total_marks: 100,
    passed: true,
    submitted_at: "2026-06-15T09:00:00Z",
  },
];

const Results = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Results</h1>

          <p className="text-gray-500 mt-2">
            View all submitted examination results.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {results.map((result) => {
            const percentage = Math.round(
              (result.score / result.total_marks) * 100,
            );

            return (
              <div
                key={result.attempt_id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition p-6"
              >
                {/* Header */}

                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {result.exam_title}
                  </h2>

                  {result.passed ? (
                    <span className="flex items-center gap-2 bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                      <FaCheckCircle />
                      Passed
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                      <FaTimesCircle />
                      Failed
                    </span>
                  )}
                </div>

                {/* Score */}

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="rounded-xl bg-blue-100 p-4">
                    <FaTrophy className="text-blue-500 text-2xl mb-2" />

                    <p className="text-xs text-gray-500">Score</p>

                    <h3 className="text-xl font-bold">
                      {result.score}/{result.total_marks}
                    </h3>
                  </div>

                  <div
                    className={`rounded-xl p-4 ${
                      result.passed ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <p className="text-xs text-gray-500">Percentage</p>

                    <h3
                      className={`text-xl font-bold ${
                        result.passed ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {percentage}%
                    </h3>
                  </div>
                </div>

                {/* Submitted */}

                <div className="flex items-center gap-2 mt-5 text-gray-500">
                  <FaCalendarAlt className="text-orange-500" />

                  <span>
                    {new Date(result.submitted_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Button */}

                <Link
                  to={`/result/${result.attempt_id}`}
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-green-500 hover:bg-green-600 text-white py-3 font-semibold transition"
                >
                  View Result
                  <FaArrowRight />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Results;
