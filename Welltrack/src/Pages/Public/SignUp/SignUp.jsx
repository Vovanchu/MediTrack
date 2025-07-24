import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../API/accounts"; // перевір шлях
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

  // Окремі стани для кожного поля
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowRepeatPassword = () => setShowRepeatPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await registerUser(formData);
      console.log("Registered:", res.data);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Error registering:", err);
      if (err.response?.data) {
        setError(formatErrors(err.response.data));
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Failed to register. Try again.");
      }
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
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          {error && (
            <p
              className="auth-message"
              style={{ color: "red", whiteSpace: "pre-wrap" }}
            >
              {error}
            </p>
          )}
          {success && (
            <p className="auth-message" style={{ color: "green" }}>
              {success}
            </p>
          )}
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}
