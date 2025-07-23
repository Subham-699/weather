import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../src/components/SerachBar";
import WeatherCard from "../src/components/WeatherCard";
import "../src/styles/WeatherCard.css";

const APIKEY = "70c90c754d874177953170902252007"; 

function App() {
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("C");
  const [darkMode, setDarkMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const fetchWeather = async (city) => {
    const normalizedCity = city.trim().toLowerCase();
    if (!normalizedCity) {
      setError("Please enter a valid city name.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [currentRes, forecastRes] = await Promise.all([
        axios.get("https://api.weatherapi.com/v1/current.json", {
          params: { key: APIKEY, q: normalizedCity },
        }),
        axios.get("https://api.weatherapi.com/v1/forecast.json", {
          params: { key: APIKEY, q: normalizedCity, days: 3 },
        }),
      ]);

      if (
        currentRes.data &&
        currentRes.data.location &&
        currentRes.data.current &&
        forecastRes.data &&
        forecastRes.data.forecast
      ) {
        setWeatherData((prev) => ({
          ...prev,
          [normalizedCity]: {
            current: currentRes.data.current,
            location: currentRes.data.location,
            forecast: forecastRes.data.forecast.forecastday,
          },
        }));
        setLastUpdated(Date.now());
      } else {
        setError("Unexpected API response");
      }
    } catch (err) {
      setError(
        "API error: " + (err.response?.data?.error?.message || err.message || "Unknown")
      );
    }

    setLoading(false);
  };

  const addCity = (city) => {
    const normalizedCity = city.trim().toLowerCase();
    if (!normalizedCity || cities.includes(normalizedCity)) return;
    setCities((prev) => [...prev, normalizedCity]);
    fetchWeather(normalizedCity);
  };

  const removeCity = (city) => {
    const normalizedCity = city.trim().toLowerCase();
    setCities((prev) => prev.filter((c) => c !== normalizedCity));
    setWeatherData((prev) => {
      const newData = { ...prev };
      delete newData[normalizedCity];
      return newData;
    });
  };

  const toggleUnit = () => setUnit((u) => (u === "C" ? "F" : "C"));
  const toggleDarkMode = () => setDarkMode((d) => !d);

  return (
    <div className="container">
      <h1>🌤️ Weather Dashboard</h1>

      <div className="controls">
        <button onClick={toggleUnit}>
          Switch to {unit === "C" ? "°F" : "°C"}
        </button>
        <button onClick={toggleDarkMode}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <SearchBar onAddCity={addCity} />

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="weather-grid">
        {cities.map((city) => {
          const data = weatherData[city];
          return data ? (
            <WeatherCard
              key={city}
              cityKey={city}
              weather={data}
              unit={unit}
              lastUpdated={lastUpdated}
              onRemove={() => removeCity(city)}
            />
          ) : null;
        })}
      </div>
    </div>
  );
}

export default App;