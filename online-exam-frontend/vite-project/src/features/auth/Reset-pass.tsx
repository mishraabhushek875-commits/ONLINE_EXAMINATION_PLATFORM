import React, { useState } from "react";
import { MdLockPerson, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { GiBorderedShield } from "react-icons/gi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password strength checker
  const getStrength = (val: string) => {
    if (!val) return { label: "", color: "", width: "0%" };
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    if (score === 1)
      return { label: "Weak", color: "bg-red-500", width: "25%" };
    if (score === 2)
      return { label: "Fair", color: "bg-orange-400", width: "50%" };
    if (score === 3)
      return { label: "Good", color: "bg-yellow-400", width: "75%" };
    if (score === 4)
      return { label: "Strong", color: "bg-green-500", width: "100%" };
    return { label: "", color: "", width: "0%" };
  };

  const strength = getStrength(newPass);
  const passwordsMatch = confirmPass && newPass === confirmPass;
  const passwordsMismatch = confirmPass && newPass !== confirmPass;
  const isValid = newPass.length >= 8 && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);

    // TODO: Call reset password API here
    await new Promise((res) => setTimeout(res, 1500));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[140px]" />
      <div className="absolute top-20 -right-32 h-[350px] w-[350px] rounded-full bg-emerald-500/20 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-orange-500/15 blur-[140px]" />
      <div className="absolute bottom-20 right-1/4 h-[250px] w-[250px] rounded-full bg-red-500/15 blur-[120px]" />
      <div className="absolute top-20 right-[600px] h-[250px] w-[250px] z-11 rounded-full bg-purple-500/15 blur-[60px]" />

      {/* Card */}
      <div className="p-8 flex flex-col items-center justify-center bg-white z-10 gap-5 shadow-2xl rounded-2xl w-full max-w-sm mx-4">
        {/* Icon */}
        <div className="p-4 bg-purple-50 rounded-full">
          <GiBorderedShield className="text-purple-500" size={70} />
        </div>

        {!success ? (
          <>
            {/* Heading */}
            <div className="text-center">
              <h1 className="text-2xl font-bold">
                Reset <span className="text-blue-500">Password</span>
              </h1>
              <p className="mt-2 text-sm font-semibold text-gray-500 text-center">
                Create a <span className="text-orange-500">new password</span>{" "}
                for your account.{" "}
                <span className="text-green-500">Make it strong!</span>
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-4"
            >
              {/* New Password */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-500 font-semibold text-sm">
                  New Password
                </label>
                <div
                  className={`w-full border-2 px-4 py-2 rounded-lg flex gap-3 items-center transition-colors duration-200
                    ${
                      newPass.length > 0 && newPass.length < 8
                        ? "border-red-400 bg-red-50"
                        : newPass.length >= 8
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300"
                    }
                    focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100`}
                >
                  <MdLockPerson
                    size={20}
                    className={
                      newPass.length > 0 && newPass.length < 8
                        ? "text-red-400"
                        : newPass.length >= 8
                          ? "text-green-500"
                          : "text-gray-400"
                    }
                  />
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password..."
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="outline-none w-full text-sm text-gray-700 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((p) => !p)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNew ? (
                      <MdVisibilityOff size={18} />
                    ) : (
                      <MdVisibility size={18} />
                    )}
                  </button>
                </div>

                {/* Strength Bar */}
                {newPass && (
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <p
                      className={`text-xs font-semibold
                      ${
                        strength.label === "Weak"
                          ? "text-red-500"
                          : strength.label === "Fair"
                            ? "text-orange-400"
                            : strength.label === "Good"
                              ? "text-yellow-500"
                              : "text-green-500"
                      }`}
                    >
                      {strength.label} password
                    </p>
                  </div>
                )}

                {newPass.length > 0 && newPass.length < 8 && (
                  <p className="text-red-500 text-xs font-medium">
                    Password must be at least 8 characters.
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-500 font-semibold text-sm">
                  Confirm Password
                </label>
                <div
                  className={`w-full border-2 px-4 py-2 rounded-lg flex gap-3 items-center transition-colors duration-200
                    ${
                      passwordsMismatch
                        ? "border-red-400 bg-red-50"
                        : passwordsMatch
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300"
                    }
                    focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100`}
                >
                  <MdLockPerson
                    size={20}
                    className={
                      passwordsMismatch
                        ? "text-red-400"
                        : passwordsMatch
                          ? "text-green-500"
                          : "text-gray-400"
                    }
                  />
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm your password..."
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="outline-none w-full text-sm text-gray-700 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirm ? (
                      <MdVisibilityOff size={18} />
                    ) : (
                      <MdVisibility size={18} />
                    )}
                  </button>
                </div>
                {passwordsMismatch && (
                  <p className="text-red-500 text-xs font-medium">
                    Passwords do not match.
                  </p>
                )}
                {passwordsMatch && (
                  <p className="text-green-500 text-xs font-medium">
                    Passwords match! ✓
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isValid || loading}
                className={`w-full rounded-xl py-3 font-semibold text-white transition duration-300
                  ${
                    isValid && !loading
                      ? "bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 hover:scale-[1.02] hover:shadow-xl active:scale-95"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
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
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </>
        ) : (
          /* ── Success State ── */
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-full">
              <MdLockPerson className="text-green-500" size={48} />
            </div>
            <h2 className="text-xl font-bold">
              Password <span className="text-blue-500">Reset!</span>
            </h2>
            <p className="text-sm font-semibold text-gray-500 max-w-xs">
              Your password has been{" "}
              <span className="text-green-500">successfully updated</span>. You
              can now <span className="text-orange-500">login</span> with your
              new password.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 py-3 font-semibold text-white transition duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95"
            >
              Go to Login
            </button>
          </div>
        )}

        {/* Back to Login */}
        {!success && (
          <div
            className="flex gap-2 items-center justify-center cursor-pointer"
            onClick={() => navigate("/login")}
          >
            <FaArrowLeftLong className="text-orange-500" />
            <button className="border rounded-2xl px-2 py-1 font-semibold bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 bg-clip-text text-transparent cursor-pointer">
              Back to login
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
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

export default ResetPassword;
