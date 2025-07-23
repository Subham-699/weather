import React, { useState } from "react";

const SearchBar = ({ onAddCity }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    onAddCity(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        placeholder="Enter city name"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-btn">
        Search City
      </button>
    </form>
  );
};

export default SearchBar;
