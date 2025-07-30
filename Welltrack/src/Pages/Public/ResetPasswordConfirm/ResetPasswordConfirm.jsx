import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { verifyToken, resetPasswordConfirm } from "@/api/accounts";

export default function ResetPasswordConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [isTokenValid, setIsTokenValid] = useState(null); // null - чек, true/false - результат
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      return;
    }
    verifyToken(token)
      .then(() => setIsTokenValid(true))
      .catch(() => setIsTokenValid(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPasswordConfirm({ token, new_password: newPassword });
      Swal.fire({
        icon: "success",
        title: "Password reset successful",
        text: "You can now log in with your new password.",
      });
      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Reset failed",
        text:
          error.response?.data?.detail ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isTokenValid === null) return <p>Validating token...</p>;
  if (!isTokenValid)
    return (
      <div>
        <h2>Invalid or expired token</h2>
        <p>Please request a new password reset link.</p>
      </div>
    );

  return (
    <div className="reset-password-confirm-container">
      <h2>Set New Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            disabled={loading}
            placeholder="Enter your new password"
          />
        </div>
        <button type="submit" disabled={loading || newPassword.length < 8}>
          {loading ? "Saving..." : "Save New Password"}
        </button>
      </form>
    </div>
  );
}
