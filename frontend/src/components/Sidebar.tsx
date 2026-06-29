"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Library,
  ClipboardList,
  HelpCircle,
  UserCheck,
  ListChecks,
  BarChart3,
  Settings,
  GraduationCap,
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Question Banks", href: "/admin/question-banks", icon: Library },
  { label: "Tests", href: "/admin/exams", icon: ClipboardList },
  { label: "Questions", href: "/admin/questions", icon: HelpCircle },
  { label: "Exam Assignments", href: "/admin/assignments", icon: UserCheck },
  { label: "Attempts", href: "/admin/attempts", icon: ListChecks },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const admin = useAuthStore((s) => s.admin);

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-0 -translate-x-full lg:translate-x-0 lg:w-20"
      } shrink-0 border-r border-ink-100 bg-white h-screen sticky top-0 flex flex-col transition-all duration-200 overflow-hidden`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="grid h-9 w-9 shrink-0 grid-cols-2 grid-rows-2 overflow-hidden rounded-lg">
          <span className="bg-emerald-500" />
          <span className="bg-amber-400" />
          <span className="bg-rose-400" />
          <span className="bg-sky-500" />
        </span>
        {sidebarOpen && (
          <span className="font-serif text-lg italic text-ink-900 whitespace-nowrap">
            Matnite Infotech
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-violet-50 text-violet-600"
                  : "text-ink-500 hover:bg-ink-50 hover:text-ink-900"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / admin pill */}
      <div className="border-t border-ink-100 p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-600">
            <GraduationCap size={18} />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-900">
                {admin?.full_name || "Admin"}
              </p>
              <p className="truncate text-xs text-ink-400">Administrator</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
