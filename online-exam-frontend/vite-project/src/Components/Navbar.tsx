import React from "react";
import logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <div className="min-w-screen py-5 px-10 fixed z-10 flex justify-center">
      <img src={logo} alt="logo" width={100} height={15} />
    </div>
  );
};

export default Navbar;
