import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LogIn.scss";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // для повідомлення про помилку
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);

  // Фейкові дані користувача (можна замінити на справжній бекенд пізніше)
  const validUser = {
    email: "test@example.com",
    password: "123456",
    name: "Test User",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // очищаємо помилку при вводі
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (
        formData.email === validUser.email &&
        formData.password === validUser.password
      ) {
        localStorage.setItem("token", "fake-token");
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: validUser.name,
            email: validUser.email,
          })
        );

        setLoading(false);
        navigate("/profile");
      } else {
        setLoading(false);
        setError("Invalid email or password");
      }
    }, 1000);
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Log in to your account to continue</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <button
            className="btn-back"
            onClick={() => navigate(-1)}
            disabled={loading}
            aria-label="Go back"
          >
            ← Back
          </button>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              disabled={loading}
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={toggleShowPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}{" "}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Loading..." : "Log In"}
          </button>
        </form>

        <p className="auth-footer">
          Forgot password? <Link to="/reset-password">Reset it here</Link>
        </p>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Register</Link>
        </p>
      </div>
    </div>
  );
}
