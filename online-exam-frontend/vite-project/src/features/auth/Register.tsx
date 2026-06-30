import React from "react";
import user from "../../assets/user.png";
import notice from "../../assets/notice.png";
import graph from "../../assets/graph.png";
import badge from "../../assets/badge.png";
import RegisterForm from "../../Components/RegisterForm";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";

const Register = () => {
  const navigate = useNavigate();
  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[140px]" />
      <div className="absolute top-20 -right-32 h-[350px] w-[350px] rounded-full bg-emerald-500/20 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-orange-500/15 blur-[140px]" />
      <div className="absolute bottom-20 right-1/4 h-[250px] w-[250px] rounded-full bg-red-500/15 blur-[120px]" />
      <div className="absolute top-30 left-[270px] h-[250px] w-[250px] rounded-full bg-purple-500/15 blur-[30px]" />

      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4 pb-16 lg:pb-4">
        <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-5 z-10">
          <div className="rounded-full bg-purple-50 p-4 sm:p-5 border-2 border-purple-500 mb-6 lg:mb-10">
            <img src={user} alt="user" className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
          <div className="w-full max-w-md lg:max-w-none">
            <div className="mb-4 lg:mb-5 flex items-center gap-3 sm:gap-4 px-2 sm:px-0">
              <div className="bg-purple-200 p-2 sm:p-3 rounded-full shrink-0">
                <img
                  src={notice}
                  alt="notice"
                  className="h-8 w-8 sm:h-10 sm:w-10"
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold">Take Exams</h1>
                <p className="text-sm sm:text-base text-gray-500">
                  Attempt assigned exams and track your performance.
                </p>
              </div>
            </div>
            <div className="mb-4 lg:mb-5 flex items-center gap-3 sm:gap-4 px-2 sm:px-0">
              <div className="bg-blue-100 px-2 py-3 sm:px-3 sm:py-4 rounded-full shrink-0">
                <img
                  src={graph}
                  alt="graph"
                  className="h-7 w-8 sm:h-8 sm:w-10"
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold">Track Progress</h1>
                <p className="text-sm sm:text-base text-gray-500">
                  Monitor your scores and improvement over time.
                </p>
              </div>
            </div>
            <div className="mb-4 lg:mb-5 flex items-center gap-3 sm:gap-4 px-2 sm:px-0">
              <div className="bg-orange-100 p-2 sm:p-3 rounded-full shrink-0">
                <img
                  src={badge}
                  alt="badge"
                  className="h-8 w-8 sm:h-10 sm:w-10"
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold">Earn Badges</h1>
                <p className="text-sm sm:text-base text-gray-500">
                  Get rewarded for your achievements and milestones.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3 flex items-center justify-center z-10">
          <div className="p-6 sm:p-8 lg:p-10 w-full max-w-2xl lg:max-w-none lg:min-w-[80%] bg-white rounded-2xl shadow-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-3 sm:mb-4">
              <span className="text-green-500">Create</span> Account
            </h1>
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mb-4">
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-semibold">
                <span className="text-red-500">Sign up</span> to get{" "}
                <span className="text-blue-500">started</span> to your{" "}
                <span className="text-orange-500">learning journey</span>.
              </p>
              <div
                className="flex gap-2 items-center justify-start sm:justify-center cursor-pointer shrink-0"
                onClick={() => {
                  navigate("/login");
                }}
              >
                <button className="border rounded-2xl px-3 py-1.5 sm:px-2 sm:py-1 text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 bg-clip-text text-transparent cursor-pointer whitespace-nowrap">
                  Back to login
                </button>
                <FaArrowRightLong className="text-orange-500" />
              </div>
            </div>
            <RegisterForm />
          </div>
        </div>
      </div>

      <footer className="absolute bottom-2 sm:bottom-4 left-1/2 z-20 -translate-x-1/2 text-center text-xs sm:text-sm text-gray-500 px-4">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 bg-clip-text text-transparent">
          Matnite Infotech
        </span>
        . All rights reserved.
      </footer>
    </div>
  );
};

export default Register;
