import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // підключаємо бібліотеку
import { registerUser } from "../../../API/accounts";
import "./SignUp.scss";

function formatErrors(errorData) {
  if (!errorData) return "Unknown error";
  if (typeof errorData === "string") return errorData;
  if (Array.isArray(errorData)) return errorData.join(" ");
  if (typeof errorData === "object") {
    const messages = [];
    for (const key in errorData) {
      if (Array.isArray(errorData[key])) {
        messages.push(`${key}: ${errorData[key].join(" ")}`);
      } else if (typeof errorData[key] === "string") {
        messages.push(`${key}: ${errorData[key]}`);
      }
    }
    return messages.join("\n");
  }
  return JSON.stringify(errorData);
}

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeat_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowRepeatPassword = () => setShowRepeatPassword((prev) => !prev);

  const passwordChecks = {
    length: formData.password.length >= 8 && formData.password.length <= 30,
    uppercase: /[A-Z]/.test(formData.password),
    digit: /\d/.test(formData.password),
    special: /[!@#$%^&*]/.test(formData.password),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registerUser(formData);

      // Успіх
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Registration successful! Redirecting to login...",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const message = err.response?.data
        ? formatErrors(err.response.data)
        : "Failed to register. Try again.";

      // Виводимо помилку у popup
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join us to access all features</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <button
            className="btn-back"
            onClick={() => navigate("/")}
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

          <div className="form-group password-group">
            <label>Password</label>
            <div className="input-with-button">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                disabled={loading}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
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
          </div>

          <div className="form-group password-group">
            <label>Repeat Password</label>
            <div className="input-with-button">
              <input
                type={showRepeatPassword ? "text" : "password"}
                name="repeat_password"
                value={formData.repeat_password}
                onChange={handleChange}
                placeholder="Repeat your password"
                required
                disabled={loading}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={toggleShowRepeatPassword}
                aria-label={
                  showRepeatPassword
                    ? "Hide repeat password"
                    : "Show repeat password"
                }
              >
                {showRepeatPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="password-hints">
            <p style={{ color: passwordChecks.length ? "green" : "gray" }}>
              • 8–30 characters
            </p>
            <p style={{ color: passwordChecks.uppercase ? "green" : "gray" }}>
              • At least one uppercase letter (A-Z)
            </p>
            <p style={{ color: passwordChecks.digit ? "green" : "gray" }}>
              • At least one number (0-9)
            </p>
            <p style={{ color: passwordChecks.special ? "green" : "gray" }}>
              • At least one special character (ex. !@#$%^&*)
            </p>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Profile"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}
