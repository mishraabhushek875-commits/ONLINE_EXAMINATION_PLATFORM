import { useState } from "react";
import { FaPlus, FaTimes, FaTrash, FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { useAdminQuestions, useCreateQuestion, useDeleteQuestion } from "../../hooks/useadmin";
import type { QuestionCat } from "../../types/admin.types";

const CATEGORIES: QuestionCat[] = ["Database", "Node", "Nextjs", "Reactjs"];
const CATEGORY_CLS: Record<QuestionCat, string> = {
  Database: "bg-emerald-100 text-emerald-600",
  Node: "bg-orange-100 text-orange-600",
  Nextjs: "bg-blue-100 text-blue-600",
  Reactjs: "bg-purple-100 text-purple-600",
};

const AdminQuestions = () => {
  const [filter, setFilter] = useState<QuestionCat | "">("");
  const { data: questions, isLoading } = useAdminQuestions(filter);
  const createQuestion = useCreateQuestion();
  const deleteQuestion = useDeleteQuestion();

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [category, setCategory] = useState<QuestionCat>("Node");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState<number[]>([]);

  const toggleCorrect = (i: number) =>
    setCorrect((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));

  const resetForm = () => {
    setText("");
    setCategory("Node");
    setOptions(["", "", "", ""]);
    setCorrect([]);
  };

  const handleCreate = () => {
    if (text.trim().length < 10 || options.some((o) => !o.trim()) || correct.length === 0) return;
    createQuestion.mutate(
      { text, category, options, correctOptionIndexes: correct },
      { onSuccess: () => { setOpen(false); resetForm(); } },
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this question?")) return;
    deleteQuestion.mutate(id);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Questions</h1>
          <p className="text-sm text-gray-500">{questions?.length ?? 0} questions</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:scale-[1.02] hover:shadow-lg transition"
        >
          <FaPlus size={12} /> Add Question
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter("")}
          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${filter === "" ? "bg-blue-600 text-white" : "bg-white text-gray-500 border border-gray-200"}`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${filter === c ? "bg-blue-600 text-white" : "bg-white text-gray-500 border border-gray-200"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-white bg-white/80 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/80">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Question</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-600">Category</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-600">Options</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-400">Loading...</td></tr>
            )}
            {!isLoading && (questions?.length ?? 0) === 0 && (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-400">No questions found.</td></tr>
            )}
            {questions?.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50/80">
                <td className="px-6 py-4 font-medium text-gray-800">{q.text}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${CATEGORY_CLS[q.category]}`}>
                    {q.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-gray-600">{q.options?.length ?? "—"}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(q.id)} className="text-red-400 hover:text-red-600">
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
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Add Question</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700">
                <FaTimes size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <textarea
                placeholder="Question text (min. 10 characters)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as QuestionCat)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              <p className="text-xs font-semibold text-gray-500">Options — tap the circle to mark correct answer(s)</p>
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button onClick={() => toggleCorrect(i)} className="text-emerald-500">
                    {correct.includes(i) ? <FaCheckCircle size={18} /> : <FaRegCircle size={18} className="text-gray-300" />}
                  </button>
                  <input
                    value={opt}
                    onChange={(e) => {
                      const next = [...options];
                      next[i] = e.target.value;
                      setOptions(next);
                    }}
                    placeholder={`Option ${i + 1}`}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              ))}
              <button onClick={() => setOptions([...options, ""])} className="text-sm font-semibold text-blue-600 hover:underline">
                + Add another option
              </button>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600">
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={createQuestion.isPending}
                className="rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {createQuestion.isPending ? "Saving..." : "Save Question"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestions;