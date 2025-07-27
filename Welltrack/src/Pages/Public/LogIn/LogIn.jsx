import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginUser } from "../../../API/accounts";
import "./LogIn.scss";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    // Email повинен мати @ і домен, наприклад: test@example.com
    const emailRegex =
      /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Валідації перед відправкою ---
    if (!formData.email) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Email is required.",
      });
      return;
    }
    if (!validateEmail(formData.email)) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Please enter the correct email address.",
      });
      return;
    }
    if (!formData.password) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Password is required",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userEmail", formData.email);

      Swal.fire({
        icon: "success",
        title: "Welcome back!",
        text: "You have successfully logged in.",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/my-profile"), 1500);
    } catch (error) {
      // Якщо бекенд відхиляє логін, показуємо єдине повідомлення
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Incorrect email or password",
      });
    } finally {
      setLoading(false);
    }
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
            onClick={() => navigate("/")}
            disabled={loading}
            type="button"
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
              placeholder="Enter your password"
              required
              disabled={loading}
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={toggleShowPassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Signing In..." : "Log In"}
          </button>
        </form>

        <p className="auth-footer">
          Forgot password? <Link to="/reset-password">Reset it here</Link>
        </p>
        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
