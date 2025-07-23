import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LogIn.scss";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
    // Тут можна викликати API для логіну
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Log in to your account to continue</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Log In
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Register</Link>
        </p>
      </div>
    </div>
  );
}
