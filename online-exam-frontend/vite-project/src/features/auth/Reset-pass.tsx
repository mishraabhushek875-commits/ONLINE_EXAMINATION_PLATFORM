// src/features/auth/pages/Reset-pass.tsx
// SIRF API CALL + TOKEN SAVE + REDIRECT ADD KIYA — design bilkul same hai tera

import React, { useState } from "react";
import { MdLockPerson } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import authService from "../../services/auth";

const resetPass = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Login.tsx ne email pass kiya tha navigate state mein
  const email = (location.state as { email?: string })?.email ?? "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!otp) {
      setError("Please enter the OTP sent to your email.");
      return;
    }
    if (!email) {
      setError("Session expired. Please login again.");
      navigate("/login");
      return;
    }
    setIsLoading(true);
    try {
      // verifyOtp → { message, data: accessToken, person: { full_name, email, refreshToken } }
      const res = await authService.verifyOtp({ email, otp });

      // Token save karo — api.ts interceptor "accessToken" key padhta hai
      localStorage.setItem("accessToken", res.data);
      localStorage.setItem("refreshToken", res.person.refreshToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          full_name: res.person.full_name,
          email: res.person.email,
        }),
      );

      // Role se redirect
      try {
        const payload = JSON.parse(atob(res.data.split(".")[1]));
        navigate(
          payload.role === "admin" ? "/admin/dashboard" : "/student/dashboard",
          {
            replace: true,
          },
        );
      } catch {
        navigate("/student/dashboard", { replace: true });
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Invalid or expired OTP. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center">
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[140px]" />
      <div className="absolute top-20 -right-32 h-[350px] w-[350px] rounded-full bg-emerald-500/20 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-orange-500/15 blur-[140px]" />
      <div className="absolute bottom-20 right-1/4 h-[250px] w-[250px] rounded-full bg-red-500/15 blur-[120px]" />
      <div className="absolute top-20 right-[600px] h-[250px] w-[250px] z-11 rounded-full bg-purple-500/15 blur-[60px]" />

      <div className="p-4 flex flex-col items-center justify-center bg-white z-10 gap-5 shadow-2xl">
        <div className="p-4 bg-purple-50 rounded-full mb-4">
          <MdLockPerson className="text-purple-500" size={70} />
        </div>

        <h1 className="text-2xl font-bold">
          Verify <span className="text-blue-500">OTP</span>?
        </h1>

        <p className="max-w-sm text-center font-semibold text-gray-500">
          <span className="text-green-500">No worries!!</span> Enter your{" "}
          <span className="text-orange-500">email </span>
          and we will send a{" "}
          <span className="text-red-500"> reset password </span> otp on your
          email.
        </p>

        {/* Email info */}
        {email && (
          <p className="text-sm text-gray-400">
            OTP sent to:{" "}
            <span className="font-semibold text-gray-600">{email}</span>
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form className="w-full" onSubmit={handleVerify}>
          <label className="text-gray-500 font-semibold">OTP</label>
          <div className="w-full border-2 border-gray-400 px-4 py-2 rounded-lg flex gap-3 items-center">
            <MdLockPerson size={20} className="text-gray-500" />
            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter OTP..."
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="outline-none tracking-widest font-semibold text-lg"
              autoFocus
            />
          </div>
        </form>

        <button
          type="submit"
          onClick={handleVerify}
          disabled={isLoading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 py-3 font-semibold text-white transition duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>

        <div
          className="flex gap-2 items-center justify-center cursor-pointer"
          onClick={() => navigate("/login")}
        >
          <FaArrowLeftLong className="text-orange-500" />
          <button className="border rounded-2xl px-2 py-1 font-semibold bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 bg-clip-text text-transparent cursor-pointer">
            Back to login
          </button>
        </div>
      </div>

      <footer className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 text-center text-sm text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 bg-clip-text text-transparent">
          Matnite Infotech
        </span>
        . All rights reserved.
      </footer>
    </div>
  );
};

export default resetPass;
