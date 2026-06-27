import React from "react";
import logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <div className="min-w-screen py-5 bg-white px-10 z-10 flex justify-center border-b border-gray-200 p-5 ">
      <img src={logo} alt="logo" width={100} height={15} />
    </div>
  );
};

export default Navbar;
