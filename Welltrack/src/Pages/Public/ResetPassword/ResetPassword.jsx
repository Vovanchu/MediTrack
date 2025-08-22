import React, { useState } from "react";
import BtnBack from "../components/BtnBack/BtnBack";
import { resetPassword } from "../../../API/accounts";
import Swal from "sweetalert2";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validateEmail = (value) => {
    if (!value.trim() || value.length < 12 || value.length > 72) {
      return "Email is required and must be between 12 and 72 characters.";
    }
    if (!value.includes("@")) {
      return "Please enter the correct email address.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateEmail(email);
    if (validationError) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: validationError,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(email);
      console.log("Reset password response:", response);

      setSent(true);

      Swal.fire({
        icon: "success",
        title: "Password reset link sent",
        text: `If an account with ${email} exists, a reset link has been sent.`,
      });
    } catch (err) {
      console.error("Failed to reset password:", err);

      const serverMessage =
        err.response?.data?.detail ||
        err.response?.data?.email?.join(" ") ||
        "Something went wrong on the server. Please try again later.";

      Swal.fire({
        icon: "error",
        title: "Reset failed",
        text: serverMessage,
      });
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
      </div>
    </div>
  );
}
