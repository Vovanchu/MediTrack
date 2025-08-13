import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { registerUser, loginUser } from "../../../API/accounts";
import "./SignUp.scss";
import BtnBack from "../components/BtnBack/BtnBack";

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
    const { name, value } = e.target;
    if (name === "password" || name === "repeat_password") {
      // Видаляємо пробіли з пароля та повторного пароля
      const noSpacesValue = value.replace(/\s/g, "");
      setFormData((prev) => ({ ...prev, [name]: noSpacesValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowRepeatPassword = () => setShowRepeatPassword((prev) => !prev);

  // Перевірки пароля
  const passwordChecks = {
    length: formData.password.length >= 8 && formData.password.length <= 30,
    uppercase: /[A-Z]/.test(formData.password),
    digit: /\d/.test(formData.password),
    special: /[!@#$%^&*]/.test(formData.password),
  };

  // Валідація email формату (додатково)
  const isEmailValid = (email) => {
    if (!email.includes("@") || email.lastIndexOf(".") < email.indexOf("@")) {
      return false;
    }
    const emailName = email.split("@")[0];
    return /^[a-zA-Z0-9._+-]+$/.test(emailName);
  };

  const validateForm = () => {
    const { email, password, repeat_password } = formData;

    if (!email || email.length < 12 || email.length > 72) {
      return "Email is required and must be between 12 and 72 characters.";
    }
    if (!isEmailValid(email)) {
      return "Please enter the correct email address.";
    }
    const emailName = email.split("@")[0];
    if (!/^[a-zA-Z0-9._+-]+$/.test(emailName)) {
      return "Email name part can only contain letters, digits, '.', '_', '+', '-' characters.";
    }
    if (!password) {
      return "Password is required";
    }
    if (
      !passwordChecks.length ||
      !passwordChecks.uppercase ||
      !passwordChecks.digit ||
      !passwordChecks.special
    ) {
      return `Your password must contain:
- At least 8 characters;
- At least one uppercase letter (A-Z);
- At least one number (0-9);
- At least one special character (ex. !@#$%^&*);`;
    }
    if (password !== repeat_password) {
      return "Passwords don’t match";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.repeat_password) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Passwords don’t match",
      });
      return;
    }

    const errorMessage = validateForm();
    if (errorMessage) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: errorMessage,
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Зареєструвати користувача
      await registerUser(formData);

      // 2. Залогінитись щоб отримати токен
      const loginResponse = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      // 3. Зберегти токен у localStorage
      localStorage.setItem("accessToken", loginResponse.data.access);

      // 4. Показати повідомлення і перейти на сторінку дозаповнення профілю
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Registration successful! Redirecting to complete profile...",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/complete-profile");
      }, 2000);
    } catch (err) {
      let message = "Failed to register. Try again.";

      if (err.response?.data?.email) {
        const emailErrors = Array.isArray(err.response.data.email)
          ? err.response.data.email
          : [err.response.data.email];

        // Перевірка на текст від бекенду
        if (
          emailErrors.some((msg) =>
            msg.toLowerCase().includes("user with this email already exists")
          )
        ) {
          message = "This email is already registered.";
        } else {
          message = emailErrors.join(" ");
        }
      } else if (err.response?.data?.detail) {
        message = err.response.data.detail;
      }

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
          <BtnBack />

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              onInvalid={(e) => {
                e.target.setCustomValidity(
                  "Please enter the correct email address."
                );
              }}
              onInput={(e) => {
                e.target.setCustomValidity(""); // очищаємо повідомлення при введенні
              }}
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
                onInvalid={(e) => {
                  e.target.setCustomValidity("Password is required");
                }}
                onInput={(e) => {
                  e.target.setCustomValidity("");
                }}
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
                onInvalid={(e) => {
                  e.target.setCustomValidity("Password is required");
                }}
                onInput={(e) => {
                  e.target.setCustomValidity(""); // очищаємо повідомлення при введенні
                }}
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
