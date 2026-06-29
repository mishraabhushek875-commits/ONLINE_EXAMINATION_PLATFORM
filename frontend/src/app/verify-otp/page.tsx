"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

export default function VerifyOtpPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authService.verifyOtp(email, otp);
      const { data: accessToken, person } = res.data;
      setSession(accessToken, person.refreshToken || "", {
        full_name: person.full_name || "Admin",
        email: person.email || email,
        role: "admin",
      });
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-ink-100 bg-white p-8 text-center shadow-card">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-violet-50 text-violet-600">
          <ShieldCheck size={24} />
        </div>
        <h1 className="text-xl font-bold text-ink-900">Verify OTP</h1>
        <p className="mb-6 text-sm text-ink-500">Enter the 6-digit code sent to {email}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            placeholder="000000"
            className="w-full rounded-xl border border-ink-200 px-3 py-3 text-center text-lg tracking-widest focus:border-brand-500 focus:outline-none"
          />
          {error && <p className="text-sm text-rose-500">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Verifying..." : "Verify & Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
