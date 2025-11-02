// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DEFAULT_CITIES = ["Mumbai", "Delhi", "London", "New York"];

function Dashboard() {
  const [cities, setCities] = useState(DEFAULT_CITIES);
  const [weatherData, setWeatherData] = useState({});
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchWeather = async (city) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/weather/${city}`);
      setWeatherData((prev) => ({ ...prev, [city]: res.data }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    cities.forEach(fetchWeather);
    const interval = setInterval(() => cities.forEach(fetchWeather), 60000);
    return () => clearInterval(interval);
  }, [cities]);

  const handleAddCity = () => {
    if (search && !cities.includes(search)) {
      setCities([...cities, search]);
      setSearch("");
    }
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
              onClick={() => navigate(`/city/${city}`)}
            >
              <h2>{city}</h2>
              {data ? (
                <>
                  <p>{data.weather[0].description}</p>
                  <h3>{data.main.temp}°C</h3>
                  <p>💧 {data.main.humidity}% | 🌬 {data.wind.speed} m/s</p>
                  <p>Click for details →</p>
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
