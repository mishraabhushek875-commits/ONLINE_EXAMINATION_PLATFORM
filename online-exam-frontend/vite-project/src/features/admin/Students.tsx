import { useState } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import { useAdminStudents, useDeleteStudent } from "../../hooks/useadmin";

const AdminStudents = () => {
  const { data: students, isLoading } = useAdminStudents();
  const deleteStudent = useDeleteStudent();
  const [query, setQuery] = useState("");

  const filtered = (students ?? []).filter((s) =>
    `${s.full_name} ${s.email} ${s.phone}`.toLowerCase().includes(query.toLowerCase()),
  );

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Remove ${name} permanently? This cannot be undone.`)) return;
    deleteStudent.mutate(id);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Students</h1>
          <p className="text-sm text-gray-500">{students?.length ?? 0} students enrolled</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white bg-white/80 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3">
          <FaSearch className="text-gray-400" size={14} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>

        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/80">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Student</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Phone</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-600">Attempts</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-600">Assigned Exams</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-600"></th>
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
                  No students found.
                </td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr key={s.id} className="transition hover:bg-gray-50/80">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                      {s.full_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{s.full_name}</p>
                      <p className="text-xs text-gray-400">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{s.phone}</td>
                <td className="px-6 py-4 text-center text-gray-600">{s.attempts?.length ?? 0}</td>
                <td className="px-6 py-4 text-center text-gray-600">{s.assignedExams?.length ?? 0}</td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      s.status === "active" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(s.id, s.full_name)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <FaTrash size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStudents;