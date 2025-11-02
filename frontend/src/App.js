import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DetailedWeather from "./pages/DetailedWeather";
import Favorites from "./pages/Favorites";
import { AuthContext } from "./context/AuthContext";

const DEFAULT_CITIES = ["Mumbai", "Delhi", "London", "New York"];

// 🌍 Backend Base URL (change after deployment)
const API_BASE_URL = "https://your-weather-api.onrender.com";

function App() {
  const { user } = useContext(AuthContext);

  const userFavoritesKey = user ? `favorites_${user.uid}` : "favorites_guest";

  const [cities, setCities] = useState(DEFAULT_CITIES);
  const [weatherData, setWeatherData] = useState({});
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem(userFavoritesKey)) || []
  );
  const [unit, setUnit] = useState("metric"); // metric=°C, imperial=°F

  // ✅ Load unit preference from localStorage on first load
  useEffect(() => {
    const savedUnit = localStorage.getItem("unit");
    if (savedUnit) setUnit(savedUnit);
  }, []);

  // ✅ Load favorites again if user changes (login/logout)
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem(userFavoritesKey)) || [];
    setFavorites(storedFavorites);
  }, [user]);

  // ✅ Fetch weather for each city
  const fetchWeather = async (city) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/weather/${city}?unit=${unit}`
      );
      setWeatherData((prev) => ({ ...prev, [city]: res.data }));
    } catch (err) {
      console.log("Weather fetch error:", err);
    }
  };

  useEffect(() => {
    cities.forEach(fetchWeather);
    const interval = setInterval(() => {
      cities.forEach(fetchWeather);
    }, 60000);
    return () => clearInterval(interval);
  }, [cities, unit]);

  const handleAddCity = () => {
    if (search && !cities.includes(search)) {
      setCities([...cities, search]);
      setSearch("");
    }
  };

  // ✅ Updated favorite handling (per user)
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
    <Router>
      <Navbar unit={unit} setUnit={setUnit} />
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <div>
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
                      <div key={city} className="card">
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
                            <button onClick={() => handleFavorite(city)}>
                              {favorites.includes(city)
                                ? "★ Favorite"
                                : "☆ Add Favorite"}
                            </button>
                          </>
                        ) : (
                          <p>Loading...</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            }
          />
          <Route path="/details/:city" element={<DetailedWeather unit={unit} />} />
          <Route path="/favorites" element={<Favorites unit={unit} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
