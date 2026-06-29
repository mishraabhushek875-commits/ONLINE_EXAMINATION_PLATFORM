"use client";

import { useEffect, useState } from "react";
import DataTable, { Column } from "@/components/DataTable";
import Badge from "@/components/ui/Badge";
import { attemptService } from "@/services/attemptService";
import { examService } from "@/services/examService";
import { AttemptStatus, Exam, ExamAttempt } from "@/types";

const STATUS_TONE: Record<AttemptStatus, "green" | "amber" | "red"> = {
  submitted: "green",
  in_progress: "amber",
  expired: "red",
};

export default function AttemptsPage() {
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [examFilter, setExamFilter] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await examService.getAll();
        setExams(res.data.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const load = async () => {
    setLoading(true);
    setErrored(false);
    try {
      const res = await attemptService.getAll(examFilter ? { examId: examFilter as number } : undefined);
      setAttempts(res.data.data);
    } catch (err) {
      console.error(err);
      setErrored(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examFilter]);

  const columns: Column<ExamAttempt>[] = [
    {
      header: "Student",
      accessor: (a) => (
        <div>
          <p className="font-medium text-ink-900">{a.student?.full_name || `#${a.studentId}`}</p>
          <p className="text-xs text-ink-400">{a.student?.email}</p>
        </div>
      ),
    },
    { header: "Test", accessor: (a) => a.exam?.title || `#${a.examId}` },
    { header: "Status", accessor: (a) => <Badge tone={STATUS_TONE[a.status]}>{a.status.replace("_", " ")}</Badge> },
    {
      header: "Score",
      accessor: (a) =>
        a.score === null ? "—" : `${a.score} / ${a.exam?.totalMarks ?? "—"}`,
    },
    {
      header: "Started At",
      accessor: (a) => new Date(a.startedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    },
    {
      header: "Submitted At",
      accessor: (a) =>
        a.submittedAt
          ? new Date(a.submittedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
          : "—",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Attempts</h1>
          <p className="text-sm text-ink-500">Every student attempt across all tests.</p>
        </div>
        <select
          value={examFilter}
          onChange={(e) => setExamFilter(e.target.value ? Number(e.target.value) : "")}
          className="rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="">All Tests</option>
          {exams.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
      </div>

      {errored && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Couldn&apos;t load attempts — your backend doesn&apos;t expose{" "}
          <code className="rounded bg-amber-100 px-1">GET /api/admin/attempts</code> yet. Add that route
          (admin-only, returns <code className="rounded bg-amber-100 px-1">prisma.examAttempt.findMany</code> with
          exam + student included) and this page will populate automatically.
        </div>
      )}

      <DataTable
        data={attempts}
        columns={columns}
        searchKeys={(a) => `${a.student?.full_name} ${a.exam?.title}`}
        isLoading={loading}
        emptyLabel="No attempts recorded yet."
      />
    </div>
  );
}
