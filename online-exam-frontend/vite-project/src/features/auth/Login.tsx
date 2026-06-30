import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import authService from "../../services/auth";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.login({ email, password });
      navigate("/verify", { state: { email } });
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden ">
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[140px]" />
      <div className="absolute top-20 -right-32 h-[350px] w-[350px] rounded-full bg-emerald-500/20 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-orange-500/15 blur-[140px]" />
      <div className="absolute bottom-20 right-1/4 h-[250px] w-[250px] rounded-full bg-red-500/15 blur-[120px]" />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <div className="hidden w-full flex-col items-center justify-center px-8 py-12 lg:flex lg:w-1/2 lg:px-12">
          <h2 className="text-center text-3xl text-gray-500 sm:text-4xl lg:text-5xl">
            <span className="text-orange-500">Welcome</span> to
          </h2>
          <h1 className="mt-6 text-center text-7xl font-bold lg:mt-8 lg:text-9xl wave-text">
            MAT TEST
          </h1>
          <p className="mt-6 max-w-md text-center text-base text-gray-600 lg:mt-8 lg:text-lg">
            A{" "}
            <span className="text-green-500">
              Matnite's Online Examination Portal
            </span>
            , where talent meets opportunity. Sign in to begin your{" "}
            <span className="text-red-500">internship assessment</span> and take
            the next step toward your future.{" "}
            <span className="font-semibold text-blue-600">
              Matnite Infotech
            </span>
          </p>
        </div>

        <div className="flex w-full items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:w-1/2 lg:px-20 lg:py-20">
          <div className="w-full max-w-md rounded-2xl border border-white bg-white/80 p-6 shadow-2xl backdrop-blur-xl sm:rounded-3xl sm:p-8">
            <div className="mb-4 block text-center lg:hidden">
              <span className="text-xl font-bold text-orange-500">
                MAT TEST
              </span>
              <span className="ml-1 text-xl text-gray-500">Portal</span>
            </div>

            <h2 className="text-2xl font-bold sm:text-3xl">Login</h2>
            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              <span className="text-orange-500">Welcome</span> back! Please{" "}
              <span className="text-blue-500">login</span> to your{" "}
              <span className="text-green-500">account</span>.
            </p>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4 sm:mt-8 sm:space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 sm:text-base">
                  Email
                </label>
                <div className="flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 sm:py-3">
                  <FaRegEnvelope className="mr-3 flex-shrink-0 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400 sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 sm:text-base">
                  Password
                </label>
                <div className="flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 sm:py-3">
                  <FaLock className="mr-3 flex-shrink-0 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400 sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex-shrink-0"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="cursor-pointer text-gray-500" />
                    ) : (
                      <FaEye className="cursor-pointer text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="h-4 w-4 accent-blue-600" />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 py-2.5 text-sm font-semibold text-white transition duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:py-3 sm:text-base"
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
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </button>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-sm text-gray-400">OR</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?
                <Link
                  to="/signup"
                  className="ml-2 font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-4 left-1/2 z-20 w-full -translate-x-1/2 text-center text-xs text-gray-500 sm:text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 bg-clip-text font-semibold text-transparent">
          Matnite Infotech
        </span>
        . All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
