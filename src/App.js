import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Cities from "./pages/Cities";
import About from "./pages/About";
import "./styles/WeatherCard.css";

function App() {
  const [theme, setTheme] = useState("light");
  const [unit, setUnit] = useState("C");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleUnit = () => setUnit((u) => (u === "C" ? "F" : "C"));

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar setTheme={setTheme} theme={theme} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cities" element={<Cities theme={theme} unit={unit} toggleUnit={toggleUnit} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;