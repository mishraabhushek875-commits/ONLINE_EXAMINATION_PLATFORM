import { useEffect, useState } from "react";
import { FaPlus, FaTimes, FaTrash, FaListUl, FaSearch } from "react-icons/fa";
import {
  useQuestionBanks,
  useCreateBank,
  useDeleteBank,
  useQuestionBankDetail,
  useUpdateBankQuestions,
  useAdminQuestions,
} from "../../hooks/useadmin";
import type { QuestionCat } from "../../types/admin.types";

const CATEGORIES: QuestionCat[] = ["Database", "Node", "Nextjs", "Reactjs"];
const CATEGORY_CLS: Record<QuestionCat, string> = {
  Database: "bg-emerald-100 text-emerald-600",
  Node: "bg-orange-100 text-orange-600",
  Nextjs: "bg-blue-100 text-blue-600",
  Reactjs: "bg-purple-100 text-purple-600",
};

const AdminQuestionBank = () => {
  const { data: banks, isLoading } = useQuestionBanks();
  const createBank = useCreateBank();
  const deleteBank = useDeleteBank();

  // Create modal
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  // Manage-questions modal
  const [manageBankId, setManageBankId] = useState<number | null>(null);
  const [manageTitle, setManageTitle] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState<QuestionCat | "">("");

  const { data: bankDetail } = useQuestionBankDetail(manageBankId);
  const { data: allQuestions, isLoading: questionsLoading } = useAdminQuestions(catFilter);
  const updateBankQuestions = useUpdateBankQuestions();

  useEffect(() => {
    if (bankDetail) {
      setSelected((bankDetail.questions ?? []).map((q) => q.id));
      setManageTitle(bankDetail.title);
    }
  }, [bankDetail]);

  const handleCreate = () => {
    if (title.trim().length < 3) return;
    createBank.mutate(title.trim(), {
      onSuccess: () => {
        setOpen(false);
        setTitle("");
      },
    });
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This removes the bank entirely.`)) return;
    deleteBank.mutate(id);
  };

  const toggleSelect = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const handleSaveQuestions = () => {
    if (manageBankId === null || manageTitle.trim().length < 3 || selected.length === 0) return;
    updateBankQuestions.mutate(
      { id: manageBankId, title: manageTitle.trim(), questionIds: selected },
      { onSuccess: () => setManageBankId(null) },
    );
  };

  const filteredQuestions = (allQuestions ?? []).filter((q) =>
    q.text.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">Question Banks</h1>
          <p className="text-sm text-gray-500">{banks?.length ?? 0} banks created</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg"
        >
          <FaPlus size={12} /> New Bank
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-gray-400">Loading...</p>}
        {!isLoading && (banks?.length ?? 0) === 0 && <p className="text-gray-400">No question banks yet.</p>}
        {banks?.map((b) => (
          <div key={b.id} className="rounded-3xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur-xl">
            <div className="mb-3 flex items-start justify-between gap-2">
              <h3 className="font-bold text-gray-800">{b.title}</h3>
              <button onClick={() => handleDelete(b.id, b.title)} className="shrink-0 text-red-400 hover:text-red-600">
                <FaTrash size={13} />
              </button>
            </div>
            <p className="text-sm text-gray-500">{b._count?.question ?? 0} questions</p>
            <p className="mt-1 text-xs text-gray-400">
              Created {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
            <button
              onClick={() => setManageBankId(b.id)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
            >
              <FaListUl size={12} /> Manage Questions
            </button>
          </div>
        ))}
      </div>

      {/* Create bank modal */}
      {open && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">New Question Bank</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700">
                <FaTimes size={16} />
              </button>
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bank title (min. 3 characters)"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600">
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={createBank.isPending}
                className="rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {createBank.isPending ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage questions modal — pick existing questions from the Questions table */}
      {manageBankId !== null && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 p-2 sm:p-4">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-3xl bg-white p-4 shadow-2xl sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Manage Questions — {manageTitle}</h2>
              <button onClick={() => setManageBankId(null)} className="text-gray-400 hover:text-gray-700">
                <FaTimes size={16} />
              </button>
            </div>

            <p className="mb-3 text-xs text-gray-500">
              {selected.length} question{selected.length === 1 ? "" : "s"} selected — tap to add/remove from this bank
            </p>

            {/* search + category filter */}
            <div className="mb-3 flex flex-col gap-2 sm:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
                <FaSearch className="text-gray-400" size={13} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>
              <select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value as QuestionCat | "")}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 space-y-1.5 overflow-y-auto rounded-xl border border-gray-100 p-2">
              {questionsLoading && <p className="py-8 text-center text-sm text-gray-400">Loading questions...</p>}
              {!questionsLoading && filteredQuestions.length === 0 && (
                <p className="py-8 text-center text-sm text-gray-400">No questions found. Create some in the Questions tab first.</p>
              )}
              {filteredQuestions.map((q) => (
                <label
                  key={q.id}
                  className={`flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-50 ${
                    selected.includes(q.id) ? "bg-blue-50/60" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(q.id)}
                    onChange={() => toggleSelect(q.id)}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800">{q.text}</p>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${CATEGORY_CLS[q.category]}`}>
                      {q.category}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-4">
              <button onClick={() => setManageBankId(null)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600">
                Cancel
              </button>
              <button
                onClick={handleSaveQuestions}
                disabled={updateBankQuestions.isPending || selected.length === 0}
                className="rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {updateBankQuestions.isPending ? "Saving..." : `Save (${selected.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestionBank;