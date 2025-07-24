import React, { useState } from "react";

const SearchBar = ({ onAddCity, theme }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    onAddCity(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center mb-6">
      <input
        type="text"
        placeholder="Enter city name"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={`p-2 border rounded-l-md w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          theme === "dark" ? "bg-gray-700 text-white border-gray-600" : 
          theme === "neon" ? "bg-green-800 text-green-200 border-green-600" : 
          "bg-white text-black border-gray-300"
        }`}
      />
      <button
        type="submit"
        className={`p-2 rounded-r-md ${
          theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : 
          theme === "neon" ? "bg-green-600 hover:bg-green-700" : 
          "bg-blue-500 hover:bg-blue-600"
        } text-white`}
      >
        Add City
      </button>
    </form>
  );
};

export default SearchBar;