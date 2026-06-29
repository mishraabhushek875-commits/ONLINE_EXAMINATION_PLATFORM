import { useState } from "react";
import { FaKey, FaEnvelope, FaShieldAlt } from "react-icons/fa";
import { useAuthStore } from "../../store/authStore";
import { useForgotPassword, useResetPassword } from "../../hooks/useAuth";

const AdminSettings = () => {
  const user = useAuthStore((s) => s.user);
  const forgotPassword = useForgotPassword();
  const resetPassword = useResetPassword();

  const [step, setStep] = useState<"idle" | "otp-sent" | "done">("idle");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const email = user?.email as string | undefined;

  const sendOtp = () => {
    if (!email) return;
    setError("");
    forgotPassword.mutate({ email }, { onSuccess: () => setStep("otp-sent") });
  };

  const submitReset = () => {
    if (!email) return;
    if (newPassword.length < 6) return setError("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");
    setError("");
    resetPassword.mutate(
      { email, otp, newPassword },
      {
        onSuccess: () => {
          setStep("done");
          setOtp("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (err: any) => setError(err?.response?.data?.message || "Invalid or expired OTP"),
      },
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500">Manage your admin profile and account security.</p>
      </div>

      <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur-xl">
        <h2 className="mb-4 font-bold text-gray-800">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
            {(user?.full_name as string)?.charAt(0) || "A"}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{(user?.full_name as string) || "Admin"}</p>
            <p className="flex items-center gap-1 text-sm text-gray-500">
              <FaEnvelope size={12} /> {email || "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur-xl">
        <h2 className="mb-1 flex items-center gap-2 font-bold text-gray-800">
          <FaKey size={15} /> Change Password
        </h2>
        <p className="mb-4 text-sm text-gray-500">
          We'll email a one-time code to {email || "your registered email"} to confirm it's you.
        </p>

        {step === "idle" && (
          <button
            onClick={sendOtp}
            disabled={forgotPassword.isPending}
            className="rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {forgotPassword.isPending ? "Sending..." : "Send OTP"}
          </button>
        )}

        {step === "otp-sent" && (
          <div className="space-y-3">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className="w-full max-w-xs rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full max-w-xs rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full max-w-xs rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={submitReset}
                disabled={resetPassword.isPending}
                className="rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {resetPassword.isPending ? "Updating..." : "Update Password"}
              </button>
              <button onClick={() => setStep("idle")} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600">
                Cancel
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <FaShieldAlt size={14} /> Password updated successfully.
          </p>
        )}

        {error && step === "idle" && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default AdminSettings;