import React, { useRef, useState, useEffect } from "react";
import { MdLockPerson } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    // Accept only single digit
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    // Auto-focus next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const updated = Array(6).fill("");
    pasted.split("").forEach((char, i) => (updated[i] = char));
    setOtp(updated);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setOtp(Array(6).fill(""));
    inputRefs.current[0]?.focus();
    // TODO: Call resend OTP API here
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) return;
    // TODO: Call verify OTP API here
    console.log("OTP submitted:", enteredOtp);
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background blobs — matching resetPass page */}
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[140px]" />
      <div className="absolute top-20 -right-32 h-[350px] w-[350px] rounded-full bg-emerald-500/20 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-orange-500/15 blur-[140px]" />
      <div className="absolute bottom-20 right-1/4 h-[250px] w-[250px] rounded-full bg-red-500/15 blur-[120px]" />
      <div className="absolute top-20 right-[600px] h-[250px] w-[250px] z-11 rounded-full bg-purple-500/15 blur-[60px]" />

      {/* Card */}
      <div className="p-8 flex flex-col items-center justify-center bg-white z-10 gap-5 shadow-2xl rounded-2xl w-full max-w-sm mx-4">
        {/* Icon */}
        <div className="p-4 bg-purple-50 rounded-full">
          <MdLockPerson className="text-purple-500" size={70} />
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Verify <span className="text-blue-500">OTP</span>
          </h1>
          <p className="mt-2 text-sm font-semibold text-gray-500 max-w-xs text-center">
            We've sent a <span className="text-orange-500">6-digit code</span>{" "}
            to your registered email.{" "}
            <span className="text-green-500">Check your inbox!</span>
          </p>
        </div>

        {/* OTP Input Boxes */}
        <form
          onSubmit={handleVerify}
          className="w-full flex flex-col items-center gap-5"
        >
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-11 h-12 text-center text-xl font-bold border-2 rounded-lg outline-none transition-all duration-200
                  ${
                    digit
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-700"
                  }
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-200`}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={!isComplete}
            className={`w-full rounded-xl py-3 font-semibold text-white transition duration-300
              ${
                isComplete
                  ? "bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 hover:scale-[1.02] hover:shadow-xl active:scale-95"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            Verify OTP
          </button>
        </form>

        {/* Resend Timer */}
        <div className="text-sm text-gray-500 font-medium text-center">
          {canResend ? (
            <span>
              Didn't receive code?{" "}
              <button
                onClick={handleResend}
                className="font-semibold bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 bg-clip-text text-transparent cursor-pointer"
              >
                Resend OTP
              </button>
            </span>
          ) : (
            <span>
              Resend OTP in{" "}
              <span className="text-red-500 font-bold">
                00:{String(timer).padStart(2, "0")}
              </span>
            </span>
          )}
        </div>

        {/* Back to Login */}
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

export default VerifyOtp;
