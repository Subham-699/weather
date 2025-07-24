import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ setTheme, theme }) => {
  const themes = ["light", "dark"];

  return (
    <nav className={`p-4 ${theme === "dark" ? "bg-gray-800" : "bg-blue-500"} text-white shadow-md`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">Weather Dashboard</div>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/cities" className="hover:text-gray-300">Cities</Link>
          <Link to="/about" className="hover:text-gray-300">About Us</Link>
          <select
            onChange={(e) => setTheme(e.target.value)}
            value={theme}
            className="bg-transparent border rounded p-1 text-white"
          >
            {themes.map((t) => (
              <option key={t} value={t} className="text-black">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;