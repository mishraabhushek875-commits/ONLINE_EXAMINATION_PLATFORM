import { useMemo, useState } from "react";
import { FaUserPlus, FaTimes, FaTrash } from "react-icons/fa";
import {
  useAdminExams,
  useAdminStudents,
  useAssignedStudents,
  useBulkAssign,
  useRemoveAssignment,
} from "../../hooks/useadmin";

const AdminAssignments = () => {
  const { data: exams } = useAdminExams();
  const { data: students } = useAdminStudents();
  const [examId, setExamId] = useState<number | "">("");
  const { data: assigned, isLoading } = useAssignedStudents(examId);
  const bulkAssign = useBulkAssign();
  const removeAssignment = useRemoveAssignment();

  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<number[]>([]);

  const effectiveExamId = examId || exams?.[0]?.id || "";

  const assignedIds = useMemo(() => new Set((assigned ?? []).map((a) => a.studentId)), [assigned]);
  const unassignedStudents = (students ?? []).filter((s) => !assignedIds.has(s.id));

  const handleBulkAssign = () => {
    if (!effectiveExamId || picked.length === 0) return;
    bulkAssign.mutate(
      { examId: effectiveExamId as number, studentIds: picked },
      { onSuccess: () => { setOpen(false); setPicked([]); } },
    );
  };

  const handleRemove = (studentId: number) => {
    if (!effectiveExamId || !confirm("Remove this student's assignment?")) return;
    removeAssignment.mutate({ examId: effectiveExamId as number, studentId });
  };

  const selectedExam = exams?.find((e) => e.id === effectiveExamId);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Exam Assignments</h1>
          <p className="text-sm text-gray-500">Assign exams to students and manage who's enrolled.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          disabled={!effectiveExamId}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:scale-[1.02] hover:shadow-lg transition disabled:opacity-50"
        >
          <FaUserPlus size={12} /> Assign Students
        </button>
      </div>

      <div className="mb-5 rounded-3xl border border-white bg-white/80 p-4 shadow-sm backdrop-blur-xl">
        <label className="mb-1 block text-xs font-semibold text-gray-500">Select Exam</label>
        <select
          value={effectiveExamId}
          onChange={(e) => setExamId(Number(e.target.value))}
          className="w-full max-w-md rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
        >
          {exams?.map((e) => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
        {selectedExam && (
          <p className="mt-2 text-xs text-gray-400">
            {assigned?.length ?? 0} students assigned · {selectedExam._count?.attempts ?? 0} attempts so far
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-white bg-white/80 shadow-sm backdrop-blur-xl">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/80">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Student</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Phone</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Assigned On</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-400">Loading...</td></tr>
            )}
            {!isLoading && (assigned?.length ?? 0) === 0 && (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-400">No students assigned to this exam yet.</td></tr>
            )}
            {assigned?.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50/80">
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-800">{a.student?.full_name}</p>
                  <p className="text-xs text-gray-400">{a.student?.email}</p>
                </td>
                <td className="px-6 py-4 text-gray-600">{a.student?.phone || "—"}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(a.assignedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleRemove(a.studentId)} className="text-red-400 hover:text-red-600">
                    <FaTrash size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 p-4">
          <div className="flex max-h-[80vh] w-full max-w-md flex-col rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Assign Students</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700">
                <FaTimes size={16} />
              </button>
            </div>
            <p className="mb-3 text-xs text-gray-500">{picked.length} selected</p>
            <div className="flex-1 space-y-1 overflow-y-auto">
              {unassignedStudents.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-400">Every student is already assigned.</p>
              )}
              {unassignedStudents.map((s) => (
                <label key={s.id} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={picked.includes(s.id)}
                    onChange={() =>
                      setPicked((p) => (p.includes(s.id) ? p.filter((x) => x !== s.id) : [...p, s.id]))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{s.full_name}</p>
                    <p className="text-xs text-gray-400">{s.email}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-4">
              <button onClick={() => setOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600">
                Cancel
              </button>
              <button
                onClick={handleBulkAssign}
                disabled={bulkAssign.isPending || picked.length === 0}
                className="rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {bulkAssign.isPending ? "Assigning..." : `Assign ${picked.length || ""}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAssignments;