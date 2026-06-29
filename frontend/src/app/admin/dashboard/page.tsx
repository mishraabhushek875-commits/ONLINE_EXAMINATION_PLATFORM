"use client";

import Link from "next/link";
import { Users, Library, ClipboardList, HelpCircle } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function DashboardPage() {
  const { loading, exams, banks, students, totalQuestions } = useDashboardData();

  const topBanks = [...banks]
    .sort((a, b) => (b._count?.question || 0) - (a._count?.question || 0))
    .slice(0, 5);

  const recentStudents = [...students]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const recentExams = [...exams]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Dashboard</h1>
          <p className="text-sm text-ink-500">Welcome back, Admin! Here&apos;s what&apos;s happening today.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Students"
          value={loading ? "—" : students.length}
          icon={Users}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Question Banks"
          value={loading ? "—" : banks.length}
          icon={Library}
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
        />
        <StatCard
          label="Total Tests"
          value={loading ? "—" : exams.length}
          icon={ClipboardList}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          label="Total Questions"
          value={loading ? "—" : totalQuestions}
          icon={HelpCircle}
          iconBg="bg-sky-50"
          iconColor="text-sky-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recently added students */}
        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-ink-900">Recently Enrolled Students</h2>
            <Link href="/admin/students" className="text-sm font-medium text-violet-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-1">
            {recentStudents.length === 0 && !loading && (
              <p className="py-6 text-center text-sm text-ink-400">No students yet.</p>
            )}
            {recentStudents.map((s) => (
              <div key={s.id} className="flex items-center justify-between border-b border-ink-50 py-2.5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-600">
                    {s.full_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-900">{s.full_name}</p>
                    <p className="text-xs text-ink-400">{s.email}</p>
                  </div>
                </div>
                <Badge tone={s.status === "active" ? "green" : "red"}>{s.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Top question banks */}
        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-ink-900">Top Question Banks</h2>
            <Link href="/admin/question-banks" className="text-sm font-medium text-violet-600 hover:underline">
              View All
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-400">
                <th className="py-2 font-medium">Title</th>
                <th className="py-2 text-right font-medium">Total Questions</th>
              </tr>
            </thead>
            <tbody>
              {topBanks.length === 0 && !loading && (
                <tr>
                  <td colSpan={2} className="py-6 text-center text-ink-400">
                    No question banks yet.
                  </td>
                </tr>
              )}
              {topBanks.map((b) => (
                <tr key={b.id} className="border-t border-ink-50">
                  <td className="py-2.5 text-ink-700">{b.title}</td>
                  <td className="py-2.5 text-right font-medium text-ink-900">{b._count?.question ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent exams / "all type of tests" */}
      <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-ink-900">Recent Tests</h2>
          <Link href="/admin/exams" className="text-sm font-medium text-violet-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-ink-500">
                <th className="px-2 py-2 font-medium">Title</th>
                <th className="px-2 py-2 font-medium">Question Bank</th>
                <th className="px-2 py-2 font-medium">Duration</th>
                <th className="px-2 py-2 font-medium">Total Marks</th>
                <th className="px-2 py-2 font-medium">Assigned</th>
                <th className="px-2 py-2 font-medium">Attempts</th>
              </tr>
            </thead>
            <tbody>
              {recentExams.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-2 py-6 text-center text-ink-400">
                    No tests created yet.
                  </td>
                </tr>
              )}
              {recentExams.map((e) => (
                <tr key={e.id} className="border-b border-ink-50 last:border-0">
                  <td className="px-2 py-2.5 font-medium text-ink-900">{e.title}</td>
                  <td className="px-2 py-2.5 text-ink-700">{e.questionBank?.title || "—"}</td>
                  <td className="px-2 py-2.5 text-ink-700">{e.duration} mins</td>
                  <td className="px-2 py-2.5 text-ink-700">{e.totalMarks}</td>
                  <td className="px-2 py-2.5 text-ink-700">{e._count?.assignments ?? 0}</td>
                  <td className="px-2 py-2.5 text-ink-700">{e._count?.attempts ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
