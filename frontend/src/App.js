import React, { useEffect, useState, useContext } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DetailedWeather from "./pages/DetailedWeather";
import Favorites from "./pages/Favorites";
import Dashboard from "./pages/Dashboard";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);
  const [unit, setUnit] = useState("metric"); // °C or °F

  useEffect(() => {
    const savedUnit = localStorage.getItem("unit");
    if (savedUnit) setUnit(savedUnit);
  }, []);

  return (
    <Router>
      <Navbar unit={unit} setUnit={setUnit} />
      <div className="App">
        <Routes>
         
          <Route path="/" element={<Dashboard />} />

        
          <Route path="/details/:city" element={<DetailedWeather unit={unit} />} />

        
          <Route path="/favorites" element={<Favorites unit={unit} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
