import { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import login from "../../../assets/login.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[140px]" />
      <div className="absolute top-20 -right-32 h-[350px] w-[350px] rounded-full bg-emerald-500/20 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-orange-500/15 blur-[140px]" />
      <div className="absolute bottom-20 right-1/4 h-[250px] w-[250px] rounded-full bg-red-500/15 blur-[120px]" />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Left Section */}
        <div className="hidden w-1/2 flex-col items-center justify-center px-12 lg:flex">
          <h2 className="text-5xl text-gray-500">
            <span className="text-orange-500">Welcome</span> to
          </h2>
          <h1 className="mt-8 text-9xl font-bold wave-text">MAT TEST</h1>

          <p className="mt-8 max-w-md text-center text-lg text-gray-600">
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

        {/* Right Section */}
        <div className="flex w-full items-center justify-center p-6 lg:w-1/2 lg:p-20">
          <div className="w-full max-w-md rounded-3xl border border-white bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
            <h2 className="text-3xl font-bold text-gray-800">Login</h2>

            <p className="mt-2 text-gray-500">
              Welcome back! Please login to your account.
            </p>

            <form className="mt-8 space-y-5">
              {/* Email */}
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Email
                </label>

                <div className="flex items-center rounded-xl border border-gray-300 bg-white px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <FaRegEnvelope className="mr-3 text-gray-400" />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-transparent outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Password
                </label>

                <div className="flex items-center rounded-xl border border-gray-300 bg-white px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <FaLock className="mr-3 text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full bg-transparent outline-none placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="cursor-pointer text-gray-500" />
                    ) : (
                      <FaEye className="cursor-pointer text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
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

              {/* Login Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 py-3 font-semibold text-white transition duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95"
              >
                Login
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />

                <span className="text-sm text-gray-400">OR</span>

                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Signup */}
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

export default Login;
