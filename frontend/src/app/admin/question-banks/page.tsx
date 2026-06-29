"use client";

import { useEffect, useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import Link from "next/link";
import DataTable, { Column } from "@/components/DataTable";
import Button from "@/components/ui/Button";
import { bankService } from "@/services/bankService";
import { QuestionBank } from "@/types";

export default function QuestionBanksPage() {
  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await bankService.getAll();
    setBanks(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (title.trim().length < 3) return;
    setSaving(true);
    try {
      await bankService.create(title.trim());
      setOpen(false);
      setTitle("");
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this question bank?")) return;
    await bankService.remove(id);
    load();
  };

  const columns: Column<QuestionBank>[] = [
    {
      header: "Title",
      accessor: (b) => (
        <Link href={`/admin/question-banks/${b.id}`} className="font-medium text-ink-900 hover:text-violet-600">
          {b.title}
        </Link>
      ),
    },
    { header: "Total Questions", accessor: (b) => b._count?.question ?? 0 },
    {
      header: "Created",
      accessor: (b) => new Date(b.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    },
    {
      header: "",
      accessor: (b) => (
        <button onClick={() => handleDelete(b.id)} className="text-rose-500 hover:text-rose-600">
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Question Banks</h1>
          <p className="text-sm text-ink-500">{banks.length} banks created</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} /> New Bank
        </Button>
      </div>

      <DataTable
        data={banks}
        columns={columns}
        searchKeys={(b) => b.title}
        isLoading={loading}
        emptyLabel="No question banks yet."
      />

      {open && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink-900">New Question Bank</h2>
              <button onClick={() => setOpen(false)} className="text-ink-400 hover:text-ink-700">
                <X size={18} />
              </button>
            </div>
            <input
              placeholder="Bank title (min. 3 characters)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            />
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={saving}>
                {saving ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
