// src/pages/Dashboard.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const DEFAULT_CITIES = ["Mumbai", "Delhi", "London", "New York"];
const API_BASE_URL = "https://weather-app-x9dy.onrender.com";

function Dashboard() {
  const [cities, setCities] = useState(DEFAULT_CITIES);
  const [weatherData, setWeatherData] = useState({});
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // ✅ User-specific favorites (saved locally)
  const { user } = useContext(AuthContext);
  const userFavoritesKey = user ? `favorites_${user.uid}` : "favorites_guest";
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem(userFavoritesKey)) || []
  );

  // ✅ Fetch weather for a city
  const fetchWeather = async (city) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/weather/${city}`);
      setWeatherData((prev) => ({ ...prev, [city]: res.data }));
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Auto-refresh weather data every 1 minute
  useEffect(() => {
    cities.forEach(fetchWeather);
    const interval = setInterval(() => cities.forEach(fetchWeather), 60000);
    return () => clearInterval(interval);
  }, [cities]);

  // ✅ Add new city
  const handleAddCity = () => {
    if (search && !cities.includes(search)) {
      setCities([...cities, search]);
      setSearch("");
    }
  };

  // ✅ Add/remove from favorites
  const handleFavorite = (city) => {
    let updated;
    if (favorites.includes(city)) {
      updated = favorites.filter((c) => c !== city);
    } else {
      updated = [...favorites, city];
    }
    setFavorites(updated);
    localStorage.setItem(userFavoritesKey, JSON.stringify(updated));
  };

  return (
    <div className="App">
      <h1>🌤 Weather Dashboard</h1>

      <div className="search">
        <input
          type="text"
          placeholder="Search city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleAddCity}>Add</button>
      </div>

      <div className="cards">
        {cities.map((city) => {
          const data = weatherData[city];
          return (
            <div
              key={city}
              className="card"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/details/${city}`)} // ✅ Click card → navigate
            >
              <h2>{city}</h2>
              {data ? (
                <>
                  <p>{data.weather[0].description}</p>
                  <h3>{data.main.temp}°C</h3>
                  <p>💧 {data.main.humidity}% | 🌬 {data.wind.speed} m/s</p>

                  {/* ✅ Favorite Button (doesn't trigger navigation) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent navigation when button clicked
                      handleFavorite(city);
                    }}
                  >
                    {favorites.includes(city) ? "★ Favorite" : "☆ Add Favorite"}
                  </button>

                  <p style={{ fontSize: "0.9rem", color: "#555" }}>
                    Click for details →
                  </p>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
