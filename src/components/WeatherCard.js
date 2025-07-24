import React, { useState } from "react";

const WeatherCard = ({ weather, unit, lastUpdated, onRemove, theme }) => {
  const [selectedDay, setSelectedDay] = useState(0);

  if (!weather || !weather.location || !weather.current) return null;

  const { location, current, forecast } = weather;

  return (
    <div className={`p-5 rounded-xl shadow-lg relative text-center ${
      theme === "dark" ? "bg-gray-800/80 text-white" : 
      theme === "neon" ? "bg-green-900/80 text-green-200" : 
      "bg-white/80 text-black"
    } backdrop-blur-sm hover:-translate-y-2 transition-transform`}>
      <button
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold bg-transparent border-none"
        title="Remove city"
        onClick={onRemove}
      >
        ×
      </button>

      <h2 className="text-xl font-semibold mb-2">
        {location.name}, {location.region}
      </h2>

      <div className="flex items-center justify-center mb-3">
        <img
          src={current.condition.icon}
          alt={current.condition.text}
          className="w-12 mr-2"
        />
        <span className="text-lg font-bold">{current.condition.text}</span>
      </div>

      <p className="text-sm">
        <strong>Temperature:</strong>{" "}
        {unit === "C"
          ? `${current.temp_c.toFixed(1)} °C`
          : `${current.temp_f.toFixed(1)} °F`}
      </p>
      <p className="text-sm">
        <strong>Humidity:</strong> {current.humidity}%
      </p>
      <p className="text-sm">
        <strong>Wind Speed:</strong> {current.wind_kph} kph
      </p>
      <p className="text-xs mt-2 opacity-70">
        Last updated:{" "}
        {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "N/A"}
      </p>

      <div className="flex justify-center gap-2 flex-wrap mt-5">
        {forecast.map((day, idx) => (
          <button
            key={day.date}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              idx === selectedDay
                ? theme === "dark" ? "bg-blue-600 text-white" : 
                  theme === "neon" ? "bg-green-600 text-white" : 
                  "bg-blue-500 text-white"
                : theme === "dark" ? "bg-gray-700 text-white" : 
                  theme === "neon" ? "bg-green-800 text-green-200" : 
                  "bg-gray-200 text-black"
            }`}
            onClick={() => setSelectedDay(idx)}
          >
            {new Date(day.date).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </button>
        ))}
      </div>

      <div className="mt-5 text-sm">
        <img
          src={forecast[selectedDay].day.condition.icon}
          alt={forecast[selectedDay].day.condition.text}
          className="w-10 mb-2 mx-auto"
        />
        <strong className="block mb-2">
          {forecast[selectedDay].day.condition.text}
        </strong>
        <p>
          Max:{" "}
          {unit === "C"
            ? `${forecast[selectedDay].day.maxtemp_c.toFixed(1)} °C`
            : `${forecast[selectedDay].day.maxtemp_f.toFixed(1)} °F`}
        </p>
        <p>
          Min:{" "}
          {unit === "C"
            ? `${forecast[selectedDay].day.mintemp_c.toFixed(1)} °C`
            : `${forecast[selectedDay].day.mintemp_f.toFixed(1)} °F`}
        </p>
        <p>Avg Humidity: {forecast[selectedDay].day.avghumidity}%</p>
        <p>Chance of Rain: {forecast[selectedDay].day.daily_chance_of_rain}%</p>
      </div>
    </div>
  );
};

export default WeatherCard;