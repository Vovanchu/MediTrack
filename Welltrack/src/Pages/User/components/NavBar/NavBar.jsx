import React from "react";
import { useNavigate } from "react-router-dom";
import heart from "@/assets/images/heart.svg";
import "./NavBar.scss";

const nav_links = [
  "Services",
  "My Events",
  "Symptom Diary",
  "Health Plan",
  "My Profile",
];

function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Видаляємо токен з localStorage (або sessionStorage)
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Перенаправляємо на сторінку логіну
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <img src={heart} alt="Heart Logo" className="navbar-logo-image" />
        <h1 className="navbar-title">HealthCare</h1>
      </div>

      <nav className="navbar-links">
        {nav_links.map((link, index) => (
          <a href="#" key={index} className="navbar-link">
            {capitalizeWords(link)}
          </a>
        ))}
      </nav>

      <div className="navbar-actions">
        <button className="navbar-bell">🔔</button>
        <button className="navbar-signout" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </header>
  );
}
