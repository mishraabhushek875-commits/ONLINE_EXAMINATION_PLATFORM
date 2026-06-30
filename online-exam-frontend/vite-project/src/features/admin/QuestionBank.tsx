import { useState } from "react";
import { FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import { useQuestionBanks, useCreateBank, useDeleteBank } from "../../hooks/useadmin";

const AdminQuestionBanks = () => {
  const { data: banks, isLoading } = useQuestionBanks();
  const createBank = useCreateBank();
  const deleteBank = useDeleteBank();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

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

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Question Banks</h1>
          <p className="text-sm text-gray-500">{banks?.length ?? 0} banks created</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:scale-[1.02] hover:shadow-lg transition"
        >
          <FaPlus size={12} /> New Bank
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-gray-400">Loading...</p>}
        {!isLoading && (banks?.length ?? 0) === 0 && (
          <p className="text-gray-400">No question banks yet.</p>
        )}
        {banks?.map((b) => (
          <div
            key={b.id}
            className="rounded-3xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur-xl"
          >
            <div className="mb-3 flex items-start justify-between">
              <h3 className="font-bold text-gray-800">{b.title}</h3>
              <button onClick={() => handleDelete(b.id, b.title)} className="text-red-400 hover:text-red-600">
                <FaTrash size={13} />
              </button>
            </div>
            <p className="text-sm text-gray-500">{b._count?.question ?? 0} questions</p>
            <p className="mt-1 text-xs text-gray-400">
              Created {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
        ))}
      </div>

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
    </div>
  );
};

export default AdminQuestionBanks;