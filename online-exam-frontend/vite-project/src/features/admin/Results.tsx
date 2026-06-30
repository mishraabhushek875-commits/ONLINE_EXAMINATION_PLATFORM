import { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useAdminExams, useAdminResults, useExamResults } from "../../hooks/useadmin";

const AdminResults = () => {
  const [examId, setExamId] = useState<number | "">("");
  const { data: exams } = useAdminExams();
  const { data: resultsData, isLoading } = useAdminResults(examId ? { examId: examId as number } : undefined);
  const { data: summary } = useExamResults(examId);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Results</h1>
          <p className="text-sm text-gray-500">Every submitted attempt across all exams.</p>
        </div>
        <select
          value={examId}
          onChange={(e) => setExamId(e.target.value ? Number(e.target.value) : "")}
          className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Exams</option>
          {exams?.map((e) => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
      </div>

      {examId !== "" && summary && (
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-white bg-white/80 p-4 text-center shadow-sm backdrop-blur-xl">
            <p className="text-2xl font-bold text-gray-800">{summary.total_appeared}</p>
            <p className="text-xs text-gray-500">Appeared</p>
          </div>
          <div className="rounded-2xl border border-white bg-white/80 p-4 text-center shadow-sm backdrop-blur-xl">
            <p className="text-2xl font-bold text-emerald-600">{summary.pass_count}</p>
            <p className="text-xs text-gray-500">Passed</p>
          </div>
          <div className="rounded-2xl border border-white bg-white/80 p-4 text-center shadow-sm backdrop-blur-xl">
            <p className="text-2xl font-bold text-red-500">{summary.fail_count}</p>
            <p className="text-xs text-gray-500">Failed</p>
          </div>
          <div className="rounded-2xl border border-white bg-white/80 p-4 text-center shadow-sm backdrop-blur-xl">
            <p className="text-2xl font-bold text-blue-600">{summary.average_score}</p>
            <p className="text-xs text-gray-500">Average Score</p>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-white bg-white/80 shadow-sm backdrop-blur-xl">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/80">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Student</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Exam</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-600">Score</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-600">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">Loading...</td></tr>
            )}
            {!isLoading && (resultsData?.results.length ?? 0) === 0 && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">No submitted attempts yet.</td></tr>
            )}
            {resultsData?.results.map((r) => (
              <tr key={r.attempt_id} className="hover:bg-gray-50/80">
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-800">{r.student}</p>
                  <p className="text-xs text-gray-400">{r.student_email}</p>
                </td>
                <td className="px-6 py-4 text-gray-600">{r.exam_title}</td>
                <td className="px-6 py-4 text-center font-semibold text-gray-700">
                  {r.score}/{r.total_marks}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      r.passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {r.passed ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
                    {r.passed ? "Passed" : "Failed"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-gray-400">
                  {r.submitted_at
                    ? new Date(r.submitted_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminResults;