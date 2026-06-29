"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import DataTable, { Column } from "@/components/DataTable";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { studentService } from "@/services/studentService";
import { User } from "@/types";

export default function StudentsPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await studentService.getAll({ limit: 1000 });
      setStudents(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleStatus = async (s: User) => {
    const next = s.status === "active" ? "inactive" : "active";
    await studentService.updateStatus(s.id, next);
    load();
  };

  const columns: Column<User>[] = [
    {
      header: "Student",
      accessor: (s) => (
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-600">
            {s.full_name?.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-ink-900">{s.full_name}</p>
            <p className="text-xs text-ink-400">{s.email}</p>
          </div>
        </div>
      ),
    },
    { header: "Phone", accessor: (s) => s.phone },
    {
      header: "Joined",
      accessor: (s) => new Date(s.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    },
    {
      header: "Status",
      accessor: (s) => <Badge tone={s.status === "active" ? "green" : "red"}>{s.status}</Badge>,
    },
    {
      header: "Action",
      accessor: (s) => (
        <button
          onClick={() => toggleStatus(s)}
          className="text-sm font-medium text-violet-600 hover:underline"
        >
          {s.status === "active" ? "Deactivate" : "Activate"}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Students</h1>
          <p className="text-sm text-ink-500">{students.length} students enrolled</p>
        </div>
        <Button>
          <Plus size={16} /> Add Student
        </Button>
      </div>

      <DataTable
        data={students}
        columns={columns}
        searchKeys={(s) => `${s.full_name} ${s.email} ${s.phone}`}
        isLoading={loading}
        emptyLabel="No students found yet."
      />
    </div>
  );
}
