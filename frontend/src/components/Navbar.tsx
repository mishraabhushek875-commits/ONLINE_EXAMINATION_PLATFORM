"use client";

import { useState } from "react";
import { Menu, Bell, ChevronDown, LogOut } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function Navbar({ title }: { title?: string }) {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const admin = useAuthStore((s) => s.admin);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-100 bg-white/80 backdrop-blur px-6 py-4">
      <button
        onClick={toggleSidebar}
        className="rounded-lg p-2 text-ink-500 hover:bg-ink-50"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-5">
        <button className="relative rounded-lg p-2 text-ink-500 hover:bg-ink-50" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
            3
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-ink-50"
          >
            <div className="grid h-9 w-9 place-items-center rounded-full bg-violet-100 text-sm font-semibold text-violet-600">
              {admin?.full_name?.charAt(0) || "A"}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-ink-900">{admin?.full_name || "Admin"}</p>
              <p className="text-xs text-ink-400">Administrator</p>
            </div>
            <ChevronDown size={16} className="text-ink-400" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl border border-ink-100 bg-white py-1 shadow-card">
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
