import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const DashboardNavbar = () => {
  return (
    <div className="min-w-screen p-2 px-15 bg-ray-50 shadow-2xl shadow-gray-400 flex items-center justify-between gap-20">
      <img src={logo} alt="logo" className="w-35" />
      <div className="flex gap-20">
        <Link
          className=" font-semibold text-gray-500 hover:text-orange-500 transition-all hover:text-lg  duration-500"
          to={"/"}
        >
          Dashboard
        </Link>
        <Link
          to={"/my-exams"}
          className=" font-semibold text-gray-500 hover:text-green-500 hover:text-lg  transition-all duration-500"
        >
          Exams
        </Link>
        <Link
          to={"/results"}
          className=" font-semibold text-gray-500 hover:text-blue-500 hover:text-lg transition-all duration-500"
        >
          Results
        </Link>
      </div>
      
    </div>
  );
};

export default DashboardNavbar;
