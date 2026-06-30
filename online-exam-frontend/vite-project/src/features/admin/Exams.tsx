import { useState } from "react";
import { FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import { useAdminExams, useCreateExam, useDeleteExam, useQuestionBanks } from "../../hooks/useadmin";

const AdminExams = () => {
  const { data: exams, isLoading } = useAdminExams();
  const { data: banks } = useQuestionBanks();
  const createExam = useCreateExam();
  const deleteExam = useDeleteExam();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: 60,
    passingMarks: 40,
    totalMarks: 100,
    questionBankId: 0,
  });

  const handleCreate = () => {
    if (!form.title || !form.questionBankId) return;
    createExam.mutate(form, {
      onSuccess: () => {
        setOpen(false);
        setForm({ title: "", description: "", duration: 60, passingMarks: 40, totalMarks: 100, questionBankId: 0 });
      },
    });
  };

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteExam.mutate(id);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Exams</h1>
          <p className="text-sm text-gray-500">{exams?.length ?? 0} exams created</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:scale-[1.02] hover:shadow-lg transition"
        >
          <FaPlus size={12} /> Create Exam
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white bg-white/80 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/80">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Title</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Question Bank</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-600">Duration</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-600">Marks</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-600">Assigned</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-600">Attempts</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-400">Loading...</td>
              </tr>
            )}
            {!isLoading && (exams?.length ?? 0) === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-400">No exams created yet.</td>
              </tr>
            )}
            {exams?.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50/80">
                <td className="px-6 py-4 font-semibold text-gray-800">{e.title}</td>
                <td className="px-6 py-4 text-gray-600">{e.questionBank?.title || "—"}</td>
                <td className="px-6 py-4 text-center text-gray-600">{e.duration} mins</td>
                <td className="px-6 py-4 text-center text-gray-600">
                  {e.passingMarks}/{e.totalMarks}
                </td>
                <td className="px-6 py-4 text-center text-gray-600">{e._count?.assignments ?? 0}</td>
                <td className="px-6 py-4 text-center text-gray-600">{e._count?.attempts ?? 0}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(e.id, e.title)} className="text-red-400 hover:text-red-600">
                    <FaTrash size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Create Exam</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700">
                <FaTimes size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                placeholder="Exam title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              />
              <select
                value={form.questionBankId}
                onChange={(e) => setForm({ ...form, questionBankId: Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value={0}>Select question bank</option>
                {banks?.map((b) => (
                  <option key={b.id} value={b.id}>{b.title}</option>
                ))}
              </select>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="Duration (min)"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                  className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Total marks"
                  value={form.totalMarks}
                  onChange={(e) => setForm({ ...form, totalMarks: Number(e.target.value) })}
                  className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Passing marks"
                  value={form.passingMarks}
                  onChange={(e) => setForm({ ...form, passingMarks: Number(e.target.value) })}
                  className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600">
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={createExam.isPending}
                className="rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {createExam.isPending ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExams;