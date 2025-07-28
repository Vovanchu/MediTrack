import React from "react";
import { Link } from "react-router-dom"; // якщо хочеш SPA-навігацію
import "./Footer.scss";

const nav_links = [
  { label: "Services", href: "/services" },
  { label: "My Events", href: "/my-events" },
  { label: "Symptom Diary", href: "/symptom-diary" },
  { label: "Health Plan", href: "/health-plan" },
  { label: "My Profile", href: "/my-profile" },
];

const legal_links = [
  { label: "Privacy Policy", href: "/my-profile" },
  { label: "Terms of Service", href: "/my-profile" },
  { label: "Contact Us", href: "/my-profile" },
];

function capitalizeWords(str = "") {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Сервісні посилання */}
        <div className="footer-section">
          <h4 className="footer-title">Our Services</h4>
          <nav className="footer-nav main-nav">
            {nav_links.map(({ label, href }, index) => (
              <Link to={href} key={index} className="footer-link">
                {capitalizeWords(label)}
              </Link>
            ))}
          </nav>
        </div>

        {/* Правова інформація */}
        <div className="footer-section">
          <h4 className="footer-title">Legal</h4>
          <nav className="footer-nav legal-nav">
            {legal_links.map(({ label, href }, index) => (
              <Link to={href} key={index} className="footer-link">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <p className="footer-text">© 2025 HealthCare. All rights reserved.</p>
    </footer>
  );
}
