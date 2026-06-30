import { useMemo, useState } from "react";
import { FaSearch, FaTrash, FaTrophy } from "react-icons/fa";
import { useAdminStudents, useDeleteStudent } from "../../hooks/useadmin";
import type { AdminStudent } from "../../types/admin.types";

type ResultFilter = "all" | "passed" | "failed" | "not_attempted";
type StatusFilter = "all" | "active" | "inactive";

const totalScore = (s: AdminStudent) =>
  (s.attempts ?? []).reduce((sum, a) => sum + (a.score ?? 0), 0);

const hasPassed = (s: AdminStudent) => (s.attempts ?? []).some((a) => a.passed === true);
const hasFailed = (s: AdminStudent) =>
  (s.attempts ?? []).some((a) => a.status === "submitted" && a.passed === false);

const AdminStudents = () => {
  const { data: students, isLoading } = useAdminStudents();
  const deleteStudent = useDeleteStudent();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [resultFilter, setResultFilter] = useState<ResultFilter>("all");
  const [topRankersOnly, setTopRankersOnly] = useState(false);

  // Top 5 by total score across all attempts (only counted if they've attempted something)
  const topRankerIds = useMemo(() => {
    const ranked = [...(students ?? [])]
      .filter((s) => (s.attempts?.length ?? 0) > 0)
      .sort((a, b) => totalScore(b) - totalScore(a))
      .slice(0, 5)
      .map((s) => s.id);
    return new Set(ranked);
  }, [students]);

  const filtered = useMemo(() => {
    return (students ?? []).filter((s) => {
      const matchesQuery = `${s.full_name} ${s.email} ${s.phone}`
        .toLowerCase()
        .includes(query.toLowerCase());
      if (!matchesQuery) return false;

      if (statusFilter !== "all" && s.status !== statusFilter) return false;

      if (resultFilter === "passed" && !hasPassed(s)) return false;
      if (resultFilter === "failed" && !hasFailed(s)) return false;
      if (resultFilter === "not_attempted" && (s.attempts?.length ?? 0) > 0) return false;

      if (topRankersOnly && !topRankerIds.has(s.id)) return false;

      return true;
    });
  }, [students, query, statusFilter, resultFilter, topRankersOnly, topRankerIds]);

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Remove ${name} permanently? This cannot be undone.`)) return;
    deleteStudent.mutate(id);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">Students</h1>
          <p className="text-sm text-gray-500">
            {filtered.length} of {students?.length ?? 0} students shown
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={resultFilter}
          onChange={(e) => setResultFilter(e.target.value as ResultFilter)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Results</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
          <option value="not_attempted">Not Attempted</option>
        </select>

        <button
          onClick={() => setTopRankersOnly((v) => !v)}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
            topRankersOnly
              ? "border-amber-300 bg-amber-100 text-amber-700"
              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <FaTrophy size={12} /> Top Rankers
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white bg-white/80 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 sm:px-5">
          <FaSearch className="text-gray-400" size={14} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 sm:px-6">Student</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 sm:px-6">Phone</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600 sm:px-6">Attempts</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600 sm:px-6">Result</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600 sm:px-6">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600 sm:px-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                    No students match these filters.
                  </td>
                </tr>
              )}
              {filtered.map((s) => {
                const passed = hasPassed(s);
                const failed = hasFailed(s);
                const isTop = topRankerIds.has(s.id);
                return (
                  <tr key={s.id} className="transition hover:bg-gray-50/80">
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                          {s.full_name?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 truncate font-semibold text-gray-800">
                            {s.full_name}
                            {isTop && <FaTrophy size={12} className="shrink-0 text-amber-500" />}
                          </p>
                          <p className="truncate text-xs text-gray-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600 sm:px-6">{s.phone}</td>
                    <td className="px-4 py-4 text-center text-gray-600 sm:px-6">{s.attempts?.length ?? 0}</td>
                    <td className="px-4 py-4 text-center sm:px-6">
                      {passed && (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">Passed</span>
                      )}
                      {!passed && failed && (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-500">Failed</span>
                      )}
                      {!passed && !failed && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center sm:px-6">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          s.status === "active" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right sm:px-6">
                      <button onClick={() => handleDelete(s.id, s.full_name)} className="text-red-400 hover:text-red-600">
                        <FaTrash size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;