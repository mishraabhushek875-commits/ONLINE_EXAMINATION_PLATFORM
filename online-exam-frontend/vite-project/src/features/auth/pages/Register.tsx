import React from "react";
import user from "../../../assets/user.png";
import notice from "../../../assets/notice.png";
import graph from "../../../assets/graph.png";
import badge from "../../../assets/badge.png";
import RegisterForm from "../components/RegisterForm";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";

const Register = () => {
  const navigate = useNavigate();
  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center p-4">
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[140px]" />
      <div className="absolute top-20 -right-32 h-[350px] w-[350px] rounded-full bg-emerald-500/20 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-orange-500/15 blur-[140px]" />
      <div className="absolute bottom-20 right-1/4 h-[250px] w-[250px] rounded-full bg-red-500/15 blur-[120px]" />
      <div className="absolute top-30 left-[270px] h-[250px] w-[250px] rounded-full bg-purple-500/15 blur-[30px]" />

      {/* Left Side */}
      <div className="w-1/3 flex flex-col items-center justify-center p-5">
        <div className="rounded-full z-10 bg-purple-50 p-5 border-2 border-purple-500 mb-10">
          <img src={user} alt="user" className="w-20 h-20" />
        </div>
        <div className="ml-10">
          <div className="mb-5 flex items-center justify-center gap-4 ml-5 mr-5">
            <div className="bg-purple-200 p-3 rounded-full">
              <img src={notice} alt="notice" className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Take Exams</h1>
              <p className="text-gray-500">
                Attempt assigned exams and track your performance.
              </p>
            </div>
          </div>
          <div className="mb-5 flex items-center justify-center gap-4 ml-5 mr-5">
            <div className="bg-blue-100 px-3 py-4 rounded-full">
              <img src={graph} alt="graph" className="h-8 w-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Track Progress</h1>
              <p className="text-gray-500">
                Monitor your scores and improvement over time.
              </p>
            </div>
          </div>
          <div className="mb-5 flex items-center justify-center gap-4 ml-5 mr-5">
            <div className="bg-orange-100 p-3 rounded-full">
              <img src={badge} alt="badge" className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Earn Badges</h1>
              <p className="text-gray-500">
                Get rewarded for your achievements and milestones.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-2/3 flex items-center justify-center z-10 ">
        <div className="p-10 min-w-[80%] min-h-[80%] bg-white rounded-2xl shadow-2xl">
          <h1 className="text-5xl font-semibold mb-4">
            <span className="text-green-500">Create</span> Account
          </h1>
          <div className="flex justify-between">
            <p className="text-xl text-gray-600 font-semibold">
              <span className="text-red-500">Sign up</span> to get{" "}
              <span className="text-blue-500">started</span> to your{" "}
              <span className="text-orange-500">learning journey</span>.
            </p>
            <div
              className="flex gap-2 items-center justify-center cursor-pointer"
              onClick={() => {
                navigate("/login");
              }}
            >
              <button className="border rounded-2xl px-2 py-1 font-semibold bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 bg-clip-text text-transparent cursor-pointer">
                Back to login
              </button>
              <FaArrowRightLong className="text-orange-500" />
            </div>
          </div>
          <RegisterForm />
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

export default Register;
