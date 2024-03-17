import React from "react";
import { Link } from "react-router-dom";
import profileImage from "../assets/Apple-Black.jpg";
import "tailwindcss/tailwind.css";

function Nav() {
  return (
    <nav className="bg-white-500 p-2 w-full flex justify-between items-center">
      <div className="flex items-center">
        <img src={profileImage} alt="Logo" className="w-12 h-12 mr-2" />
        <h1 className="text-black font-semibold text-lg">Apple</h1>
      </div>
      <div className="flex items-center">
        <Link to="/" className="font-semibold text-black ml-4 hover:underline">
          Home
        </Link>
        <Link
          to="Login"
          className="font-semibold font-semiboldtext-black ml-4 hover:underline"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Nav;
