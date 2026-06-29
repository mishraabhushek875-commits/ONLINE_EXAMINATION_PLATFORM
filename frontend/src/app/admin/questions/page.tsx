"use client";

import { useEffect, useState } from "react";
import { Plus, X, Trash2, CheckCircle2, Circle } from "lucide-react";
import DataTable, { Column } from "@/components/DataTable";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { questionService } from "@/services/questionService";
import { Question, QuestionCat } from "@/types";

const CATEGORIES: QuestionCat[] = ["Database", "Node", "Nextjs", "Reactjs"];
const CATEGORY_TONE: Record<QuestionCat, "green" | "amber" | "blue" | "violet"> = {
  Database: "green",
  Node: "amber",
  Nextjs: "blue",
  Reactjs: "violet",
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<QuestionCat | "">("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [text, setText] = useState("");
  const [category, setCategory] = useState<QuestionCat>("Node");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState<number[]>([]);

  const load = async () => {
    setLoading(true);
    const res = await questionService.getAll({ limit: 200, category: filter || undefined });
    setQuestions(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const toggleCorrect = (i: number) =>
    setCorrect((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));

  const resetForm = () => {
    setText("");
    setCategory("Node");
    setOptions(["", "", "", ""]);
    setCorrect([]);
  };

  const handleCreate = async () => {
    if (text.trim().length < 10 || options.some((o) => !o.trim()) || correct.length === 0) return;
    setSaving(true);
    try {
      await questionService.create({ text, category, options, correctOptionIndexes: correct });
      setOpen(false);
      resetForm();
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this question?")) return;
    await questionService.remove(id);
    load();
  };

  const columns: Column<Question>[] = [
    { header: "Question", accessor: (q) => <span className="font-medium text-ink-900">{q.text}</span> },
    { header: "Category", accessor: (q) => <Badge tone={CATEGORY_TONE[q.category]}>{q.category}</Badge> },
    { header: "Options", accessor: (q) => q.options?.length ?? "—" },
    {
      header: "",
      accessor: (q) => (
        <button onClick={() => handleDelete(q.id)} className="text-rose-500 hover:text-rose-600">
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Questions</h1>
          <p className="text-sm text-ink-500">{questions.length} questions</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} /> Add Question
        </Button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilter("")}
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${filter === "" ? "bg-violet-500 text-white" : "bg-white text-ink-500 border border-ink-200"}`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${filter === c ? "bg-violet-500 text-white" : "bg-white text-ink-500 border border-ink-200"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <DataTable
        data={questions}
        columns={columns}
        searchKeys={(q) => q.text}
        isLoading={loading}
        emptyLabel="No questions found."
      />

      {open && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink-900">Add Question</h2>
              <button onClick={() => setOpen(false)} className="text-ink-400 hover:text-ink-700">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <textarea
                placeholder="Question text (min. 10 characters)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as QuestionCat)}
                className="w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <p className="text-xs font-medium text-ink-500">Options — tap the circle to mark correct answer(s)</p>
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button onClick={() => toggleCorrect(i)} className="text-brand-500">
                    {correct.includes(i) ? <CheckCircle2 size={20} /> : <Circle size={20} className="text-ink-300" />}
                  </button>
                  <input
                    value={opt}
                    onChange={(e) => {
                      const next = [...options];
                      next[i] = e.target.value;
                      setOptions(next);
                    }}
                    placeholder={`Option ${i + 1}`}
                    className="w-full rounded-xl border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
              ))}
              <button
                onClick={() => setOptions([...options, ""])}
                className="text-sm font-medium text-violet-600 hover:underline"
              >
                + Add another option
              </button>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={saving}>
                {saving ? "Saving..." : "Save Question"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
