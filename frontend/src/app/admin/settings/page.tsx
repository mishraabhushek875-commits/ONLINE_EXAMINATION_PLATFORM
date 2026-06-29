"use client";

import { useState } from "react";
import { KeyRound, Mail, ShieldCheck, User } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";

export default function SettingsPage() {
  const admin = useAuthStore((s) => s.admin);
  const [step, setStep] = useState<"idle" | "otp-sent" | "done">("idle");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!admin?.email) return;
    setError("");
    setLoading(true);
    try {
      await authService.forgotPassword(admin.email);
      setStep("otp-sent");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  const submitReset = async () => {
    if (!admin?.email) return;
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authService.resetPassword(admin.email, otp, newPassword);
      setStep("done");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Settings</h1>
        <p className="text-sm text-ink-500">Manage your admin profile and account security.</p>
      </div>

      {/* Profile */}
      <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
        <h2 className="mb-4 font-semibold text-ink-900">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-violet-100 text-lg font-semibold text-violet-600">
            {admin?.full_name?.charAt(0) || "A"}
          </div>
          <div>
            <p className="font-medium text-ink-900">{admin?.full_name || "Admin"}</p>
            <p className="flex items-center gap-1 text-sm text-ink-500">
              <Mail size={14} /> {admin?.email || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
        <h2 className="mb-1 flex items-center gap-2 font-semibold text-ink-900">
          <KeyRound size={18} /> Change Password
        </h2>
        <p className="mb-4 text-sm text-ink-500">
          We&apos;ll email a one-time code to {admin?.email || "your registered email"} to confirm it&apos;s you.
        </p>

        {step === "idle" && (
          <Button onClick={sendOtp} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        )}

        {step === "otp-sent" && (
          <div className="space-y-3">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className="w-full max-w-xs rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full max-w-xs rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full max-w-xs rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            />
            {error && <p className="text-sm text-rose-500">{error}</p>}
            <div className="flex gap-2">
              <Button onClick={submitReset} disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
              <Button variant="outline" onClick={() => setStep("idle")}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {step === "done" && (
          <p className="flex items-center gap-2 text-sm font-medium text-emerald-600">
            <ShieldCheck size={16} /> Password updated successfully. Use it next time you log in.
          </p>
        )}

        {error && step === "idle" && <p className="mt-2 text-sm text-rose-500">{error}</p>}
      </div>
    </div>
  );
}
