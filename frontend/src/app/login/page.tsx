"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { authService } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.login(email, password);
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-ink-100 bg-white p-8 shadow-card">
        <div className="mb-6 flex items-center gap-2">
          <span className="grid h-9 w-9 grid-cols-2 grid-rows-2 overflow-hidden rounded-lg">
            <span className="bg-emerald-500" />
            <span className="bg-amber-400" />
            <span className="bg-rose-400" />
            <span className="bg-sky-500" />
          </span>
          <span className="font-serif text-lg italic text-ink-900">Matnite Infotech</span>
        </div>

        <div className="mb-6 grid h-14 w-14 place-items-center rounded-full bg-violet-50 text-violet-600">
          <ShieldCheck size={24} />
        </div>
        <h1 className="text-2xl font-bold text-ink-900">Login</h1>
        <p className="mb-6 text-sm text-ink-500">Welcome back! Please login to your account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">Email</label>
            <div className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 py-2.5 focus-within:border-brand-500">
              <Mail size={16} className="text-ink-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full text-sm focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">Password</label>
            <div className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 py-2.5 focus-within:border-brand-500">
              <Lock size={16} className="text-ink-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full text-sm focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="text-sm text-rose-500">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
