import React, { useState } from "react";
import BtnBack from "../components/BtnBack/BtnBack";
import { resetPassword } from "../../../API/accounts"; // імпорт функції

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await resetPassword(email); // використання API-функції
      setMessage(
        response.data.detail ||
          `If an account with ${email} exists, a reset link has been sent.`
      );
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-subtitle">
          Enter your email to receive a password reset link.
        </p>

        <BtnBack />

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Sending..." : sent ? "Resend Link" : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p
            className="auth-message"
            style={{ color: "green", marginTop: "15px" }}
          >
            {message}
          </p>
        )}
        {error && (
          <p
            className="auth-message"
            style={{ color: "red", marginTop: "15px" }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
