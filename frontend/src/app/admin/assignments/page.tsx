"use client";

import { useEffect, useMemo, useState } from "react";
import { UserPlus, X, Trash2 } from "lucide-react";
import DataTable, { Column } from "@/components/DataTable";
import Button from "@/components/ui/Button";
import { examService } from "@/services/examService";
import { studentService } from "@/services/studentService";
import { assignmentService } from "@/services/assignmentService";
import { Exam, ExamAssignment, User } from "@/types";

export default function AssignmentsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [examId, setExamId] = useState<number | "">("");
  const [assigned, setAssigned] = useState<ExamAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignedLoading, setAssignedLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [examsRes, studentsRes] = await Promise.all([
          examService.getAll(),
          studentService.getAll({ limit: 1000 }),
        ]);
        setExams(examsRes.data.data);
        setStudents(studentsRes.data.data);
        if (examsRes.data.data.length > 0) setExamId(examsRes.data.data[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loadAssigned = async (id: number) => {
    setAssignedLoading(true);
    try {
      const res = await assignmentService.getAssignedStudents(id);
      setAssigned(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAssignedLoading(false);
    }
  };

  useEffect(() => {
    if (examId !== "") loadAssigned(examId as number);
  }, [examId]);

  const assignedIds = useMemo(() => new Set(assigned.map((a) => a.studentId)), [assigned]);
  const unassignedStudents = students.filter((s) => !assignedIds.has(s.id));

  const handleBulkAssign = async () => {
    if (examId === "" || picked.length === 0) return;
    setSaving(true);
    try {
      await assignmentService.assignBulk(examId as number, picked);
      setOpen(false);
      setPicked([]);
      loadAssigned(examId as number);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (studentId: number) => {
    if (examId === "" || !confirm("Remove this student's assignment?")) return;
    await assignmentService.remove(examId as number, studentId);
    loadAssigned(examId as number);
  };

  const columns: Column<ExamAssignment>[] = [
    {
      header: "Student",
      accessor: (a) => (
        <div>
          <p className="font-medium text-ink-900">{a.student?.full_name}</p>
          <p className="text-xs text-ink-400">{a.student?.email}</p>
        </div>
      ),
    },
    { header: "Phone", accessor: (a) => a.student?.phone || "—" },
    {
      header: "Assigned On",
      accessor: (a) => new Date(a.assignedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    },
    {
      header: "",
      accessor: (a) => (
        <button onClick={() => handleRemove(a.studentId)} className="text-rose-500 hover:text-rose-600">
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  const selectedExam = exams.find((e) => e.id === examId);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Exam Assignments</h1>
          <p className="text-sm text-ink-500">Assign tests to students and manage who's enrolled.</p>
        </div>
        <Button onClick={() => setOpen(true)} disabled={examId === ""}>
          <UserPlus size={16} /> Assign Students
        </Button>
      </div>

      <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-card">
        <label className="mb-1 block text-xs font-medium text-ink-500">Select Test</label>
        <select
          value={examId}
          onChange={(e) => setExamId(Number(e.target.value))}
          disabled={loading}
          className="w-full max-w-md rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
        >
          {exams.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
        {selectedExam && (
          <p className="mt-2 text-xs text-ink-400">
            {assigned.length} students assigned · {selectedExam._count?.attempts ?? 0} attempts so far
          </p>
        )}
      </div>

      <DataTable
        data={assigned}
        columns={columns}
        searchKeys={(a) => `${a.student?.full_name} ${a.student?.email}`}
        isLoading={assignedLoading}
        emptyLabel="No students assigned to this test yet."
      />

      {open && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 p-4">
          <div className="flex max-h-[80vh] w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink-900">Assign Students</h2>
              <button onClick={() => setOpen(false)} className="text-ink-400 hover:text-ink-700">
                <X size={18} />
              </button>
            </div>
            <p className="mb-3 text-xs text-ink-500">{picked.length} selected</p>
            <div className="flex-1 space-y-1 overflow-y-auto">
              {unassignedStudents.length === 0 && (
                <p className="py-6 text-center text-sm text-ink-400">
                  Every student is already assigned to this test.
                </p>
              )}
              {unassignedStudents.map((s) => (
                <label
                  key={s.id}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-ink-50"
                >
                  <input
                    type="checkbox"
                    checked={picked.includes(s.id)}
                    onChange={() =>
                      setPicked((p) => (p.includes(s.id) ? p.filter((x) => x !== s.id) : [...p, s.id]))
                    }
                    className="h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-ink-900">{s.full_name}</p>
                    <p className="text-xs text-ink-400">{s.email}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2 border-t border-ink-100 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleBulkAssign} disabled={saving || picked.length === 0}>
                {saving ? "Assigning..." : `Assign ${picked.length || ""}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
