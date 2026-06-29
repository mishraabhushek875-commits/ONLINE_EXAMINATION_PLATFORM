"use client";

import { useEffect, useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import DataTable, { Column } from "@/components/DataTable";
import Button from "@/components/ui/Button";
import { examService } from "@/services/examService";
import { bankService } from "@/services/bankService";
import { Exam, QuestionBank } from "@/types";

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: 60,
    passingMarks: 40,
    totalMarks: 100,
    questionBankId: 0,
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [examsRes, banksRes] = await Promise.all([examService.getAll(), bankService.getAll()]);
    setExams(examsRes.data.data);
    setBanks(banksRes.data.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!form.title || !form.questionBankId) return;
    setSaving(true);
    try {
      await examService.create(form);
      setOpen(false);
      setForm({ title: "", description: "", duration: 60, passingMarks: 40, totalMarks: 100, questionBankId: 0 });
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this test? This cannot be undone.")) return;
    await examService.remove(id);
    load();
  };

  const columns: Column<Exam>[] = [
    { header: "Title", accessor: (e) => <span className="font-medium text-ink-900">{e.title}</span> },
    { header: "Question Bank", accessor: (e) => e.questionBank?.title || "—" },
    { header: "Duration", accessor: (e) => `${e.duration} mins` },
    { header: "Total Marks", accessor: (e) => e.totalMarks },
    { header: "Passing Marks", accessor: (e) => e.passingMarks },
    { header: "Assigned", accessor: (e) => e._count?.assignments ?? 0 },
    { header: "Attempts", accessor: (e) => e._count?.attempts ?? 0 },
    {
      header: "",
      accessor: (e) => (
        <button onClick={() => handleDelete(e.id)} className="text-rose-500 hover:text-rose-600">
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Tests</h1>
          <p className="text-sm text-ink-500">{exams.length} tests created</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} /> Create Test
        </Button>
      </div>

      <DataTable
        data={exams}
        columns={columns}
        searchKeys={(e) => e.title}
        isLoading={loading}
        emptyLabel="No tests created yet."
      />

      {open && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink-900">Create Test</h2>
              <button onClick={() => setOpen(false)} className="text-ink-400 hover:text-ink-700">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                placeholder="Test title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
              />
              <select
                value={form.questionBankId}
                onChange={(e) => setForm({ ...form, questionBankId: Number(e.target.value) })}
                className="w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
              >
                <option value={0}>Select question bank</option>
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="Duration (min)"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                  className="rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Total marks"
                  value={form.totalMarks}
                  onChange={(e) => setForm({ ...form, totalMarks: Number(e.target.value) })}
                  className="rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Passing marks"
                  value={form.passingMarks}
                  onChange={(e) => setForm({ ...form, passingMarks: Number(e.target.value) })}
                  className="rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={saving}>
                {saving ? "Creating..." : "Create Test"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
