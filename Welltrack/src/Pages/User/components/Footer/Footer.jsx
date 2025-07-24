import React from "react";
import "./Footer.scss";

const nav_links = [
  "Services",
  "My Events",
  "Symptom Diary",
  "Health Plan",
  "My Profile",
];

const legal_links = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Contact Us", href: "#" },
];

function capitalizeWords(str) {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <nav className="footer-nav main-nav">
          {nav_links.map((link, index) => (
            <a href="#" key={index} className="footer-link">
              {capitalizeWords(link)}
            </a>
          ))}
        </nav>

        <nav className="footer-nav legal-nav">
          {legal_links.map(({ label, href }, index) => (
            <a href={href} key={index} className="footer-link">
              {label}
            </a>
          ))}
        </nav>
      </div>

      <p className="footer-text">© 2025 HealthCare. All rights reserved.</p>
    </footer>
  );
}
