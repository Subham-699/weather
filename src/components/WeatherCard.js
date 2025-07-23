import React, { useState } from "react";

const WeatherCard = ({ weather, unit, lastUpdated, onRemove }) => {
  const [selectedDay, setSelectedDay] = useState(0);

  if (!weather || !weather.location || !weather.current) return null;

  const { location, current, forecast } = weather;

  return (
    <div className="weather-card">
      <button className="remove-btn" title="Remove city" onClick={onRemove}>
        ×
      </button>

      {/* Location */}
      <h2 style={{ marginBottom: "6px", fontWeight: "600" }}>
        {location.name} 
      </h2>

      {/* Current Weather */}
      <div className="current-weather">
        <img
          src={current.condition.icon}
          alt={current.condition.text}
          style={{
            width: "48px",
            marginRight: "10px",
            verticalAlign: "middle",
            filter: "drop-shadow(0 0 2px rgba(0,0,0,0.3))",
          }}
        />
        <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          {current.condition.text}
        </span>
      </div>

      {/* Current Weather Details */}
      <p style={{ marginTop: "10px", fontSize: "15px" }}>
        <strong>Temperature:</strong>{" "}
        {unit === "C"
          ? `${current.temp_c.toFixed(1)} °C`
          : `${current.temp_f.toFixed(1)} °F`}
      </p>
      <p style={{ fontSize: "15px" }}>
        <strong>Humidity:</strong> {current.humidity}%
      </p>
      <p style={{ fontSize: "15px" }}>
        <strong>Wind Speed:</strong> {current.wind_kph} kph
      </p>
      <p style={{ fontSize: "12px", marginTop: "6px", opacity: 0.7 }}>
        Last updated:{" "}
        {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "N/A"}
      </p>

      {/* Forecast Tabs */}
      <div className="forecast-tabs">
        {forecast.map((day, idx) => (
          <button
            key={day.date}
            className={idx === selectedDay ? "active" : ""}
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

      {/* Forecast Details */}
      <div className="forecast-details">
        <img
          src={forecast[selectedDay].day.condition.icon}
          alt={forecast[selectedDay].day.condition.text}
          style={{
            width: "40px",
            verticalAlign: "middle",
            marginBottom: "5px",
            filter: "drop-shadow(0 0 2px rgba(0,0,0,0.3))",
          }}
        />
        <strong style={{ display: "block", marginBottom: "4px" }}>
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
