import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heart from "@/assets/images/heart.svg";
import "./NavBar.scss";

const nav_links = [
  { name: "Services", path: "/services" },
  { name: "My Events", path: "/my-events" },
  { name: "Symptom Diary", path: "/symptom-diary" },
  { name: "Health Plan", path: "/health-plan" },
  { name: "My Profile", path: "/my-profile" },
];

export default function NavBar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <img src={heart} alt="Heart Logo" className="navbar-logo-image" />
        <h1 className="navbar-title">HealthCare</h1>
      </div>

      {/* Звичайні лінки (desktop) */}
      <nav className="navbar-links">
        {nav_links.map((link, index) => (
          <Link to={link.path} key={index} className="navbar-link">
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Дії (дзвінок, вихід, бургер) */}
      <div className="navbar-actions">
        <button className="navbar-bell">🔔</button>
        <button className="navbar-signout" onClick={handleLogout}>
          Sign Out
        </button>

        {/* Бургер для мобільних */}
        <button
          className={`navbar-burger ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Сайдбар (відкривається справа) */}
      <div className={`navbar-sidebar ${isMenuOpen ? "active" : ""}`}>
        <button className="sidebar-close" onClick={() => setIsMenuOpen(false)}>
          ✕
        </button>
        <nav className="sidebar-links">
          {nav_links.map((link, index) => (
            <Link
              to={link.path}
              key={index}
              className="sidebar-link"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <button className="sidebar-signout" onClick={handleLogout}>
            Sign Out
          </button>
        </nav>
      </div>

      {/* Темний фон при відкритому меню */}
      {isMenuOpen && (
        <div
          className="navbar-overlay"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </header>
  );
}
