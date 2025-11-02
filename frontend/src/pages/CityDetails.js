// src/pages/CityDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function CityDetails() {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const [forecast, setForecast] = useState([]);
  const [current, setCurrent] = useState(null);

  const fetchDetails = async () => {
    try {
      // Current weather
      const res1 = await axios.get(
        `http://localhost:5000/api/weather/${cityName}`
      );
      setCurrent(res1.data);

      // Forecast data (5-day / 3-hour interval)
      const res2 = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=acfd6bb1d0f0550289d683f1507036da
&units=metric`
      );

      const chartData = res2.data.list.map((item) => ({
        time: item.dt_txt.slice(5, 16),
        temp: item.main.temp,
      }));
      setForecast(chartData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [cityName]);

  return (
    <div className="details-page">
      <button onClick={() => navigate("/")}>← Back</button>
      <h1>{cityName} Weather Details</h1>

      {current ? (
        <div className="current">
          <h2>{current.weather[0].main}</h2>
          <p>🌡 Temp: {current.main.temp}°C</p>
          <p>💧 Humidity: {current.main.humidity}%</p>
          <p>🌬 Wind: {current.wind.speed} m/s</p>
          <p>🔽 Pressure: {current.main.pressure} hPa</p>
        </div>
      ) : (
        <p>Loading current weather...</p>
      )}

      <h3>📈 Hourly Temperature Forecast</h3>
      <ResponsiveContainer width="90%" height={300}>
        <LineChart data={forecast}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="temp" stroke="#0078ff" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CityDetails;
