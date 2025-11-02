import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "../context/AuthContext"; // ✅ import context
import { auth, googleProvider } from "../firebase"; // ✅ import Firebase config
import { signInWithPopup, signOut } from "firebase/auth";

const Navbar = ({ unit, setUnit }) => {
  const [activeUnit, setActiveUnit] = useState(unit || "metric");
  const { user, setUser } = useContext(AuthContext);

  // ✅ Load saved unit preference
  useEffect(() => {
    const savedUnit = localStorage.getItem("unit");
    if (savedUnit) {
      setActiveUnit(savedUnit);
      setUnit(savedUnit);
    }
  }, [setUnit]);

  // ✅ Toggle between °C / °F
  const toggleUnit = () => {
    const newUnit = activeUnit === "metric" ? "imperial" : "metric";
    setActiveUnit(newUnit);
    setUnit(newUnit);
    localStorage.setItem("unit", newUnit);
  };

  // ✅ Google Sign-in
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      console.log("✅ Logged in:", result.user.displayName);
    } catch (err) {
      console.error("❌ Login error:", err);
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("🚪 Logged out");
    } catch (err) {
      console.error("❌ Logout error:", err);
    }
  };

  return (
    <nav className="navbar">
      <h1 className="logo">🌦 Weather Dashboard</h1>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/favorites">Favorites</Link></li>
      </ul>

      <div className="right-section">
        <div className="unit-toggle" onClick={toggleUnit}>
          {activeUnit === "metric" ? "°C" : "°F"}
        </div>

        {/* ✅ Auth Buttons */}
        {user ? (
          <div className="auth-info">
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="user-avatar"
            />
            <span>{user.displayName}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={handleLogin}>
            Sign in with Google
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
