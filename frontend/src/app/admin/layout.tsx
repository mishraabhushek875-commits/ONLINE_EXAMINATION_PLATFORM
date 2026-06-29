"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/authStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  // Avoid flashing protected content (and firing API calls) before the
  // auth check above has run / before redirect completes.
  if (!isAuthenticated) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-50/40">
        <p className="text-sm text-ink-400">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-ink-50/40">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
