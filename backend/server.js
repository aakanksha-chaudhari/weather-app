import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Enable CORS (secure config for deployment)
app.use(
  cors({
    origin: "*", // You can later restrict to your frontend URL (e.g. https://yourapp.netlify.app)
    methods: ["GET"],
  })
);

// ✅ Environment variables
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.WEATHER_API_KEY;

// 🧠 Simple in-memory cache (for faster repeated requests)
const cache = {};
const CACHE_DURATION = 60 * 1000; // 1 minute

// Helper function for caching
async function fetchWithCache(url) {
  const now = Date.now();
  if (cache[url] && now - cache[url].timestamp < CACHE_DURATION) {
    console.log("📦 Serving from cache:", url);
    return cache[url].data;
  }

  console.log("🌍 Fetching new data:", url);
  const res = await axios.get(url);
  cache[url] = { data: res.data, timestamp: now };
  return res.data;
}

// ✅ Route: Current Weather
app.get("/api/weather/:city", async (req, res) => {
  const city = req.params.city.toLowerCase();
  const unit = req.query.unit || "metric";
  const cacheKey = `${city}_${unit}`;

  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
    console.log("📦 Cache hit:", cacheKey);
    return res.json(cache[cacheKey].data);
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`
    );
    cache[cacheKey] = { data: response.data, timestamp: Date.now() };
    res.json(response.data);
  } catch (err) {
    console.error("❌ Weather API Error:", err.message);
    res.status(500).json({ error: "Weather fetch failed" });
  }
});

// ✅ Route: 5-day / 3-hour Forecast
app.get("/api/forecast/:city", async (req, res) => {
  const city = req.params.city.toLowerCase();
  const unit = req.query.unit || "metric";
  const cacheKey = `${city}_forecast_${unit}`;

  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
    console.log("📦 Cache hit:", cacheKey);
    return res.json(cache[cacheKey].data);
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${API_KEY}`
    );
    cache[cacheKey] = { data: response.data, timestamp: Date.now() };
    res.json(response.data);
  } catch (err) {
    console.error("❌ Forecast API Error:", err.message);
    res.status(500).json({ error: "Forecast fetch failed" });
  }
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🌦️ Weather API Server is running... ✅");
});

// ✅ Log key presence for debugging (optional)
console.log("Loaded API Key:", API_KEY ? "✅ Found" : "❌ Missing");

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
