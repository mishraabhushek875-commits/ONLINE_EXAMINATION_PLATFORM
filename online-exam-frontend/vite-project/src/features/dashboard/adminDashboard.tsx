import { FaUsers, FaClipboardList, FaCheckCircle, FaTrophy } from "react-icons/fa";
import { useAdminDashboard, useAdminStudents, useAdminExams } from "../../hooks/useadmin";

const StatCard = ({
  icon,
  label,
  value,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  gradient: string;
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur-xl">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`rounded-xl p-3 ${gradient}`}>{icon}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { data: stats, isLoading } = useAdminDashboard();
  const { data: students } = useAdminStudents();
  const { data: exams } = useAdminExams();

  const recentStudents = [...(students ?? [])].slice(-5).reverse();
  const recentExams = [...(exams ?? [])].slice(-5).reverse();

  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[140px]" />
      <div className="absolute top-20 -right-32 h-[350px] w-[350px] rounded-full bg-emerald-500/10 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-16 pt-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-orange-500">
            Welcome <span className="text-gray-500">back,</span>
          </p>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard 👋</h1>
          <p className="text-gray-400">Everything happening on the platform, at a glance.</p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={<FaUsers className="text-white" size={20} />}
            label="Total Students"
            value={isLoading ? "—" : stats?.total_students ?? 0}
            gradient="bg-blue-500"
          />
          <StatCard
            icon={<FaClipboardList className="text-white" size={20} />}
            label="Total Exams"
            value={isLoading ? "—" : stats?.total_exams ?? 0}
            gradient="bg-emerald-500"
          />
          <StatCard
            icon={<FaCheckCircle className="text-white" size={20} />}
            label="Total Attempts"
            value={isLoading ? "—" : stats?.total_attempts ?? 0}
            gradient="bg-orange-500"
          />
          <StatCard
            icon={<FaTrophy className="text-white" size={20} />}
            label="Pass Rate"
            value={isLoading ? "—" : stats?.pass_rate ?? "0%"}
            gradient="bg-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur-xl">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              Recently Enrolled <span className="text-blue-500">Students</span>
            </h2>
            <div className="space-y-2">
              {recentStudents.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-400">No students yet.</p>
              )}
              {recentStudents.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                      {s.full_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{s.full_name}</p>
                      <p className="text-xs text-gray-400">{s.email}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      s.status === "active" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur-xl">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              Recent <span className="text-emerald-500">Exams</span>
            </h2>
            <div className="space-y-2">
              {recentExams.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-400">No exams created yet.</p>
              )}
              {recentExams.map((e) => (
                <div key={e.id} className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{e.title}</p>
                    <p className="text-xs text-gray-400">{e.questionBank?.title || "—"}</p>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    <p>{e._count?.assignments ?? 0} assigned</p>
                    <p>{e._count?.attempts ?? 0} attempts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;