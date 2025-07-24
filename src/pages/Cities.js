import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/SerachBar";
import WeatherCard from "../components/WeatherCard";
import "../styles/WeatherCard.css";

const APIKEY = "70c90c754d874177953170902252007";

const Cities = ({ theme, unit, toggleUnit }) => {
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [weatherAnimation, setWeatherAnimation] = useState(
    <div className="default-sky">
      <div className="sun-default"></div>
    </div>
  );

  const getWeatherAnimation = (condition) => {
    const conditionText = condition?.toLowerCase();
    
    if (!conditionText || cities.length === 0) {
      return (
        <div className="default-sky">
          <div className="sun-default"></div>
        </div>
      );
    }

    if (conditionText.includes("sunny") || conditionText.includes("clear")) {
      return (
        <div className="sunny-sky">
          <div className="sun-animated"></div>
          <div className="ray-box">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`ray ray${i+1}`}></div>
            ))}
          </div>
        </div>
      );
    } else if (conditionText.includes("cloud") || conditionText.includes("overcast")) {
      return (
        <div className="cloudy-sky">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`cloud cloud${i+1}`}></div>
          ))}
        </div>
      );
    } else if (conditionText.includes("rain") || conditionText.includes("drizzle")) {
      return (
        <div className="rain-animation">
          {[...Array(100)].map((_, i) => ( // Increased number of drops
            <div key={i} className="drop" style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${0.5 + Math.random() * 1}s`,
              animationDelay: `${Math.random() * 0.5}s`
            }}></div>
          ))}
        </div>
      );
    } else if (conditionText.includes("snow") || conditionText.includes("blizzard")) {
      return (
        <div className="snow-animation">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="snowflake" style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}></div>
          ))}
        </div>
      );
    } else if (conditionText.includes("thunder") || conditionText.includes("storm")) {
      return (
        <div className="thunder-sky">
          <div className="lightning">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bolt"></div>
            ))}
          </div>
        </div>
      );
    } else if (conditionText.includes("fog") || conditionText.includes("mist")) {
      return (
        <div className="fog-animation">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`fog fog${i+1}`}></div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="sunny-sky">
        <div className="sun-animated"></div>
        <div className="ray-box">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`ray ray${i+1}`}></div>
          ))}
        </div>
      </div>
    );
  };

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
        const weatherCondition = currentRes.data.current.condition.text;
        setWeatherAnimation(getWeatherAnimation(weatherCondition));
        
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
    
    if (cities.length <= 1) {
      setWeatherAnimation(
        <div className="default-sky">
          <div className="sun-default"></div>
        </div>
      );
    }
  };

  useEffect(() => {
    if (cities.length > 0) {
      const firstCity = cities[0];
      const cityData = weatherData[firstCity];
      if (cityData) {
        const weatherCondition = cityData.current.condition.text;
        setWeatherAnimation(getWeatherAnimation(weatherCondition));
      }
    }
  }, [weatherData, cities]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {weatherAnimation}
      
      <div className="container mx-auto px-5 py-10 text-center relative z-10">
        <h1 className="text-3xl font-bold mb-8">🌤️ Weather Dashboard</h1>

        <div className="flex justify-center items-center gap-4 mb-6">
          <span className="text-lg font-medium">{unit === "C" ? "°C" : "°F"}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              onChange={toggleUnit}
              checked={unit === "F"}
            />
            <div
              className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                theme === "dark" ? "bg-blue-600 peer-checked:bg-blue-700" : "bg-blue-500 peer-checked:bg-blue-600"
              } relative`}
            ></div>
          </label>
        </div>

        <SearchBar onAddCity={addCity} theme={theme} />

        {loading && <p className="text-lg mt-3">Loading...</p>}
        {error && <p className="text-red-500 mt-3">{error}</p>}

        <div className="flex flex-wrap justify-center gap-7">
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
                theme={theme}
              />
            ) : null;
          })}
        </div>
      </div>

      <style jsx>{`
        .default-sky, .sunny-sky {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: linear-gradient(to bottom, #87CEEB 0%, #E0F7FA 100%);
        }
        
        .sun-default {
          position: absolute;
          top: 20%;
          left: 20%;
          width: 80px;
          height: 80px;
          background: #ffde00;
          border-radius: 50%;
          box-shadow: 0 0 40px #ffde00;
        }
        
        .sun-animated {
          position: absolute;
          top: 20%;
          left: 20%;
          width: 80px;
          height: 80px;
          background: #ffde00;
          border-radius: 50%;
          box-shadow: 0 0 40px #ffde00;
          animation: pulse 2s infinite alternate;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 40px #ffde00; }
          100% { transform: scale(1.05); box-shadow: 0 0 60px #ffde00; }
        }
        
        .ray-box {
          position: absolute;
          top: 20%;
          left: 20%;
          transform: translate(-50%, -50%);
        }
        .ray {
          background: #ffde00;
          position: absolute;
          width: 6px;
          height: 60px;
          border-radius: 3px;
          animation: sunny 10s infinite linear;
          transform-origin: bottom center;
        }
        .ray1 { transform: rotate(0deg); }
        .ray2 { transform: rotate(45deg); }
        .ray3 { transform: rotate(90deg); }
        .ray4 { transform: rotate(135deg); }
        .ray5 { transform: rotate(180deg); }
        .ray6 { transform: rotate(225deg); }
        .ray7 { transform: rotate(270deg); }
        .ray8 { transform: rotate(315deg); }
        
        @keyframes sunny {
          0% { opacity: 0.8; height: 60px; }
          50% { opacity: 1; height: 70px; }
          100% { opacity: 0.8; height: 60px; }
        }
        
        .cloudy-sky {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: #c9dbe9;
          overflow: hidden;
        }
        .cloud {
          position: absolute;
          width: 200px;
          height: 60px;
          background: #fff;
          border-radius: 200px;
          animation: moveclouds 15s linear infinite;
        }
        .cloud:before, .cloud:after {
          content: '';
          position: absolute;
          background: #fff;
          width: 100px;
          height: 80px;
          border-radius: 100px;
        }
        .cloud:after {
          width: 120px;
          height: 120px;
          top: -55px;
          left: 55px;
        }
        .cloud1 {
          top: 20%;
          left: 10%;
          opacity: 0.8;
          transform: scale(0.8);
        }
        .cloud2 {
          top: 30%;
          left: 60%;
          opacity: 0.6;
          transform: scale(0.6);
          animation-delay: -5s;
        }
        .cloud3 {
          top: 15%;
          left: 30%;
          opacity: 0.7;
          transform: scale(0.7);
          animation-delay: -10s;
        }
        .cloud4 {
          top: 25%;
          left: 80%;
          opacity: 0.9;
          transform: scale(0.9);
          animation-delay: -7s;
        }
        
        @keyframes moveclouds {
          0% { margin-left: 100%; }
          100% { margin-left: -100%; }
        }
        
        /* Improved Rain Animation */
        .rain-animation {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: #4a6a8d;
          overflow: hidden;
        }
        .drop {
          position: absolute;
          bottom: 100%;
          width: 3px;
          height: 25px;
          background: rgba(255, 255, 255, 0.9);
          animation: rain-fall linear infinite;
          border-radius: 100%;
          box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
        }
        @keyframes rain-fall {
          0% { 
            transform: translateY(-100px) translateX(0);
            opacity: 1;
          }
          100% { 
            transform: translateY(100vh) translateX(0);
            opacity: 0.5;
          }
        }

        /* Snow Animation */
        .snow-animation {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: #b7d1e7;
          overflow: hidden;
        }
        .snowflake {
          position: absolute;
          top: -10px;
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          filter: blur(0.5px);
          animation: snow-fall linear infinite;
        }
        @keyframes snow-fall {
          0% { 
            transform: translateY(-10px) translateX(0);
            opacity: 1;
          }
          100% { 
            transform: translateY(100vh) translateX(20px);
            opacity: 0.3;
          }
        }

        /* Thunder Animation */
        .thunder-sky {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: #0a0a0a;
        }
        .lightning {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
        }
        .bolt {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 25px solid transparent;
          border-right: 25px solid transparent;
          border-top: 100px solid yellow;
          transform: rotate(20deg);
          opacity: 0;
          animation: lightning 4s linear infinite;
        }
        .bolt:nth-child(2) {
          left: 40px;
          top: 20px;
          animation-delay: 2s;
        }
        
        @keyframes lightning {
          0% { opacity: 0; }
          10% { opacity: 1; }
          12% { opacity: 0; }
          20% { opacity: 0; }
          21% { opacity: 1; }
          22% { opacity: 0; }
          100% { opacity: 0; }
        }

        /* Fog/Mist Animation */
        .fog-animation {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: #d8d8d8;
          overflow: hidden;
        }
        .fog {
          position: absolute;
          width: 200%;
          height: 20%;
          background: linear-gradient(90deg, rgba(216,216,216,0) 0%, rgba(216,216,216,0.8) 50%, rgba(216,216,216,0) 100%);
          animation: fog-move linear infinite;
        }
        .fog1 {
          top: 20%;
          animation-duration: 30s;
        }
        .fog2 {
          top: 40%;
          animation-duration: 25s;
          animation-delay: -5s;
        }
        .fog3 {
          top: 60%;
          animation-duration: 35s;
          animation-delay: -10s;
        }
        .fog4 {
          top: 30%;
          animation-duration: 20s;
          animation-delay: -7s;
        }
        .fog5 {
          top: 50%;
          animation-duration: 40s;
          animation-delay: -15s;
        }
        @keyframes fog-move {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(50%); }
        }
      `}</style>
    </div>
  );
};

export default Cities;