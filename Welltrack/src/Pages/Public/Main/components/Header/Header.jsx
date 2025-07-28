import React from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Header.scss";
import heart from "@/assets/images/heart.svg";

export default function Header() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/signup");
  };

  return (
    <section className="section_header">
      <Link to="/" className="section_header_logo">
        <img
          src={heart}
          alt="Heart Logo"
          className="section_header_logo_image white_icon"
        />
        <h1 className="section_header_logo_title">HealthCare</h1>
      </Link>

      <div className="section_header_buttons">
        <button className="btn btn_login" onClick={handleLogin}>
          Sign In
        </button>
        <button className="btn btn_register" onClick={handleRegister}>
          Create Profile
        </button>
      </div>
    </section>
  );
}
