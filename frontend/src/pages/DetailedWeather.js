import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function DetailedWeather() {
  const { city } = useParams();
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState([]);

  // ✅ Fetch detailed data
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/weather/${city}`);
        setData(res.data);

        const forecastRes = await axios.get(
          `http://localhost:5000/api/forecast/${city}`
        );

        // Extract useful info for chart
        const hourlyData = forecastRes.data.list.slice(0, 40).map((entry) => ({
          time: entry.dt_txt.split(" ")[1].slice(0, 5), // "03:00"
          temp: entry.main.temp,
        }));

        setForecast(hourlyData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchDetails();
  }, [city]);

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/">⬅ Back to Dashboard</Link>
      <h1>{city} — Detailed Weather</h1>

      <div style={{ marginTop: "20px", fontSize: "18px" }}>
        <p>🌡 Temperature: {data.main.temp}°C</p>
        <p>💧 Humidity: {data.main.humidity}%</p>
        <p>🌬 Wind: {data.wind.speed} m/s</p>
        <p>🔽 Pressure: {data.main.pressure} hPa</p>
        <p>☁ Condition: {data.weather[0].description}</p>
      </div>

      <h2 style={{ marginTop: "40px" }}>📊 Hourly Forecast (Next 5 Days)</h2>

      {forecast.length > 0 ? (
        <div style={{ width: "100%", height: "400px" }}>
          <ResponsiveContainer>
            <LineChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#007BFF"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p>Loading hourly forecast...</p>
      )}
    </div>
  );
}

export default DetailedWeather;
