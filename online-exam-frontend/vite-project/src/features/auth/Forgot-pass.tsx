import React from "react";
import { MdMailLock } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const forgotPass = () => {
  const navigate = useNavigate();
  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center">
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[140px]" />
      <div className="absolute top-20 -right-32 h-[350px] w-[350px] rounded-full bg-emerald-500/20 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-orange-500/15 blur-[140px]" />
      <div className="absolute bottom-20 right-1/4 h-[250px] w-[250px] rounded-full bg-red-500/15 blur-[120px]" />
      <div className="absolute top-20 right-[600px] h-[250px] w-[250px] z-11 rounded-full bg-purple-500/15 blur-[60px]" />
      <div className="p-4 flex flex-col items-center justify-center bg-white z-10 gap-5 shadow-2xl">
        <div className="p-4 bg-purple-50 rounded-full mb-4">
          <MdMailLock className="text-purple-500" size={70} />
        </div>
        <h1 className="text-2xl font-bold">
          Forgot <span className="text-blue-500">Password</span>?
        </h1>
        <p className="max-w-sm text-center font-semibold text-gray-500">
          <span className="text-green-500">No worries!!</span> Enter your{" "}
          <span className="text-orange-500">email </span>
          and we will send a{" "}
          <span className="text-red-500"> reset password </span> otp on your
          email.
        </p>
        <form className="w-full">
          <label className="text-gray-500 font-semibold">Email</label>
          <div className="w-full border-2 border-gray-400 px-4 py-2 rounded-lg flex gap-3 items-center ">
            <MdMailLock size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Enter otp..."
              className="outline-none"
            />
          </div>
        </form>
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 py-3 font-semibold text-white transition duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95"
        >
          Send OTP
        </button>
        <div
          className="flex gap-2 items-center justify-center cursor-pointer"
          onClick={() => {
            navigate("/login");
          }}
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

export default forgotPass;
