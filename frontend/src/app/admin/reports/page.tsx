"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import { ClipboardCheck, Library, Percent, Users } from "lucide-react";
import { examService } from "@/services/examService";
import { bankService } from "@/services/bankService";
import { questionService } from "@/services/questionService";
import { Exam, QuestionBank, QuestionCat } from "@/types";

const CATEGORIES: QuestionCat[] = ["Database", "Node", "Nextjs", "Reactjs"];
const CATEGORY_TONE: Record<QuestionCat, "green" | "amber" | "blue" | "violet"> = {
  Database: "green",
  Node: "amber",
  Nextjs: "blue",
  Reactjs: "violet",
};

export default function ReportsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [examsRes, banksRes, ...catResults] = await Promise.all([
          examService.getAll(),
          bankService.getAll(),
          ...CATEGORIES.map((c) => questionService.getAll({ page: 1, limit: 1, category: c })),
        ]);
        setExams(examsRes.data.data);
        setBanks(banksRes.data.data);
        const counts: Record<string, number> = {};
        CATEGORIES.forEach((c, i) => {
          counts[c] = catResults[i].data.pagination?.total ?? 0;
        });
        setCategoryCounts(counts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalAssignments = exams.reduce((sum, e) => sum + (e._count?.assignments ?? 0), 0);
  const totalAttempts = exams.reduce((sum, e) => sum + (e._count?.attempts ?? 0), 0);
  const completionRate = totalAssignments > 0 ? Math.round((totalAttempts / totalAssignments) * 100) : 0;
  const totalQuestions = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Reports</h1>
        <p className="text-sm text-ink-500">A quick read on how your tests and content are performing.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Assignments"
          value={loading ? "—" : totalAssignments}
          icon={Users}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Total Attempts"
          value={loading ? "—" : totalAttempts}
          icon={ClipboardCheck}
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
        />
        <StatCard
          label="Completion Rate"
          value={loading ? "—" : `${completionRate}%`}
          icon={Percent}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          label="Question Banks"
          value={loading ? "—" : banks.length}
          icon={Library}
          iconBg="bg-sky-50"
          iconColor="text-sky-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Exam-wise completion */}
        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
          <h2 className="mb-3 font-semibold text-ink-900">Test-wise Completion</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-400">
                <th className="py-2 font-medium">Test</th>
                <th className="py-2 text-right font-medium">Assigned</th>
                <th className="py-2 text-right font-medium">Attempted</th>
                <th className="py-2 text-right font-medium">%</th>
              </tr>
            </thead>
            <tbody>
              {exams.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-ink-400">
                    No tests yet.
                  </td>
                </tr>
              )}
              {exams.map((e) => {
                const assigned = e._count?.assignments ?? 0;
                const attempts = e._count?.attempts ?? 0;
                const pct = assigned > 0 ? Math.round((attempts / assigned) * 100) : 0;
                return (
                  <tr key={e.id} className="border-t border-ink-50">
                    <td className="py-2.5 text-ink-700">{e.title}</td>
                    <td className="py-2.5 text-right text-ink-700">{assigned}</td>
                    <td className="py-2.5 text-right text-ink-700">{attempts}</td>
                    <td className="py-2.5 text-right font-medium text-ink-900">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Question category distribution */}
        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
          <h2 className="mb-3 font-semibold text-ink-900">Question Distribution by Category</h2>
          <div className="space-y-3">
            {CATEGORIES.map((c) => {
              const count = categoryCounts[c] ?? 0;
              const pct = totalQuestions > 0 ? (count / totalQuestions) * 100 : 0;
              return (
                <div key={c}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <Badge tone={CATEGORY_TONE[c]}>{c}</Badge>
                    <span className="font-medium text-ink-900">{count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
