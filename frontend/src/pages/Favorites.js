import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Favorites.css";
import { AuthContext } from "../context/AuthContext";

function Favorites({ unit }) {
  const { user } = useContext(AuthContext);
  const userFavoritesKey = user ? `favorites_${user.uid}` : "favorites_guest";

  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem(userFavoritesKey)) || []
  );
  const [weatherData, setWeatherData] = useState({});

  // ✅ Fetch weather for all favorite cities
  const fetchWeather = async (city) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/weather/${city}?unit=${unit}`
      );
      setWeatherData((prev) => ({ ...prev, [city]: res.data }));
    } catch (err) {
      console.log("Weather fetch error:", err);
    }
  };

  // ✅ Load data whenever favorites or unit change
  useEffect(() => {
    if (favorites.length > 0) favorites.forEach(fetchWeather);
  }, [favorites, unit]);

  // ✅ Sync favorites when user logs in/out
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(userFavoritesKey)) || [];
    setFavorites(stored);
  }, [user]);

  // ✅ Sync with localStorage in case another component changes it
  useEffect(() => {
    const syncFavorites = () => {
      const updated = JSON.parse(localStorage.getItem(userFavoritesKey)) || [];
      setFavorites(updated);
    };
    window.addEventListener("storage", syncFavorites);
    return () => window.removeEventListener("storage", syncFavorites);
  }, [userFavoritesKey]);

  // ✅ Save favorites when updated
  useEffect(() => {
    localStorage.setItem(userFavoritesKey, JSON.stringify(favorites));
  }, [favorites, userFavoritesKey]);

  const handleRemoveFavorite = (city) => {
    const updated = favorites.filter((c) => c !== city);
    setFavorites(updated);
  };

  if (favorites.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>No favorite cities yet 💭</h2>
        <p>Go to Home and add some 🌆</p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h1>⭐ Favorite Cities</h1>
      <div className="favorites-grid">
        {favorites.map((city) => {
          const data = weatherData[city];
          return (
            <div key={city} className="favorite-card">
              <h2>{city}</h2>
              {data ? (
                <>
                  <p>{data.weather[0].description}</p>
                  <h3>
                    {data.main.temp}°{unit === "metric" ? "C" : "F"}
                  </h3>
                  <p>
                    💧 {data.main.humidity}% | 🌬 {data.wind.speed}{" "}
                    {unit === "metric" ? "m/s" : "mph"}
                  </p>
                </>
              ) : (
                <p>Loading...</p>
              )}
              <button
                className="remove-btn"
                onClick={() => handleRemoveFavorite(city)}
              >
                ❌ Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Favorites;
