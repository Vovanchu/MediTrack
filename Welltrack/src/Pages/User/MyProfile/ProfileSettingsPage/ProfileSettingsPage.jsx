import React, { useState } from "react";
import BtnBack from "../../components/ui/BtnBack/BtnBack";
import NavBar from "../../components/NavBar/NavBar";
import "./ProfileSettingsPage.scss";
import { Eye, EyeOff, Check, X } from "lucide-react";

export default function ProfileSettingsPage() {
  const [settings, setSettings] = useState({
    profileVisibility: "private",
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    medicationReminders: true,
    twoFactorAuth: false,
    timezone: "UTC-5",
    dateFormat: "MM/DD/YYYY",
    units: "imperial",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const passwordValidation = {
    length: passwordData.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(passwordData.newPassword),
    number: /[0-9]/.test(passwordData.newPassword),
    special: /[!@#$%^&*]/.test(passwordData.newPassword),
    match:
      passwordData.newPassword === passwordData.confirmPassword &&
      passwordData.newPassword.length > 0,
  };

  const [activeTab, setActiveTab] = useState("privacy");

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = () => {
    console.log("Password change requested", passwordData);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleDeleteAccount = () => {
    console.log("Account deletion requested");
  };

  return (
    <div className="profile-settings-page">
      <NavBar />
      <main className="container">
        <div className="page-header">
          <div className="page-header-text">
            <h1>Profile Settings</h1>
            <p>Manage your account preferences, privacy, and security</p>
          </div>
          <BtnBack />
        </div>

        <nav className="tabs">
          <ul className="tabs-list">
            {["privacy", "notifications", "security", "account"].map((tab) => (
              <li key={tab}>
                <button
                  className={`tabs-trigger ${
                    activeTab === tab ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>

          <div className="tabs-content">
            {activeTab === "privacy" && (
              <section className="tab-section privacy-section">
                <h2>Privacy Settings</h2>
                <div className="form-group">
                  <label>Profile Visibility</label>
                  <select
                    value={settings.profileVisibility}
                    onChange={(e) =>
                      handleSettingChange("profileVisibility", e.target.value)
                    }
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="healthcare">
                      Healthcare providers only
                    </option>
                  </select>
                </div>
              </section>
            )}

            {activeTab === "notifications" && (
              <section className="tab-section notifications-section">
                <h2>Notification Preferences</h2>
                <div className="form-switch">
                  <label>Email Notifications</label>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) =>
                      handleSettingChange(
                        "emailNotifications",
                        e.target.checked
                      )
                    }
                  />
                </div>
                <div className="form-switch">
                  <label>Push Notifications</label>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) =>
                      handleSettingChange("pushNotifications", e.target.checked)
                    }
                  />
                </div>
                <div className="form-switch">
                  <label>SMS Notifications</label>
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) =>
                      handleSettingChange("smsNotifications", e.target.checked)
                    }
                  />
                </div>
                <div className="form-switch">
                  <label>Appointment Reminders</label>
                  <input
                    type="checkbox"
                    checked={settings.appointmentReminders}
                    onChange={(e) =>
                      handleSettingChange(
                        "appointmentReminders",
                        e.target.checked
                      )
                    }
                  />
                </div>
                <div className="form-switch">
                  <label>Medication Reminders</label>
                  <input
                    type="checkbox"
                    checked={settings.medicationReminders}
                    onChange={(e) =>
                      handleSettingChange(
                        "medicationReminders",
                        e.target.checked
                      )
                    }
                  />
                </div>
              </section>
            )}

            {activeTab === "security" && (
              <section className="tab-section security-section">
                <h2>Security Settings</h2>
                <div className="form-switch">
                  <label>Two-Factor Authentication</label>
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) =>
                      handleSettingChange("twoFactorAuth", e.target.checked)
                    }
                  />
                </div>

                <div className="change-password">
                  <h3>Change Password</h3>

                  <div className="password-field">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      placeholder="Current Password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      className="toggle-visibility"
                      onClick={() => togglePassword("current")}
                    >
                      {showPassword.current ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  <div className="password-field">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      placeholder="New Password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      className="toggle-visibility"
                      onClick={() => togglePassword("new")}
                    >
                      {showPassword.new ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  {/* Вимоги до паролю */}
                  <ul className="password-requirements">
                    <li
                      className={
                        passwordValidation.length ? "valid" : "invalid"
                      }
                    >
                      {passwordValidation.length ? (
                        <Check size={16} />
                      ) : (
                        <X size={16} />
                      )}
                      At least 8 characters
                    </li>
                    <li
                      className={
                        passwordValidation.uppercase ? "valid" : "invalid"
                      }
                    >
                      {passwordValidation.uppercase ? (
                        <Check size={16} />
                      ) : (
                        <X size={16} />
                      )}
                      At least one uppercase letter (A-Z)
                    </li>
                    <li
                      className={
                        passwordValidation.number ? "valid" : "invalid"
                      }
                    >
                      {passwordValidation.number ? (
                        <Check size={16} />
                      ) : (
                        <X size={16} />
                      )}
                      At least one number (0-9)
                    </li>
                    <li
                      className={
                        passwordValidation.special ? "valid" : "invalid"
                      }
                    >
                      {passwordValidation.special ? (
                        <Check size={16} />
                      ) : (
                        <X size={16} />
                      )}
                      At least one special character (!@#$%^&*)
                    </li>

                    <li
                      className={passwordValidation.match ? "valid" : "invalid"}
                    >
                      {passwordValidation.match ? (
                        <Check size={16} />
                      ) : (
                        <X size={16} />
                      )}
                      New password and confirmation must match
                    </li>
                  </ul>

                  <div className="password-field">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      className="toggle-visibility"
                      onClick={() => togglePassword("confirm")}
                    >
                      {showPassword.confirm ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  <button
                    className="btn-primary"
                    onClick={handlePasswordChange}
                    disabled={
                      !passwordData.currentPassword ||
                      !(
                        passwordValidation.length &&
                        passwordValidation.uppercase &&
                        passwordValidation.number &&
                        passwordValidation.special &&
                        passwordValidation.match
                      )
                    }
                  >
                    Update Password
                  </button>

                  {!passwordData.currentPassword && (
                    <small
                      style={{
                        color: "#dc2626",
                        display: "block",
                        marginTop: "0.5rem",
                      }}
                    >
                      Please enter your current password to enable password
                      change
                    </small>
                  )}
                </div>
              </section>
            )}

            {activeTab === "account" && (
              <section className="tab-section account-section">
                <h2>Account Preferences</h2>
                <div className="form-group grid-2cols">
                  <div>
                    <label>Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) =>
                        handleSettingChange("timezone", e.target.value)
                      }
                    >
                      <option value="UTC-5">Eastern Time (UTC-5)</option>
                      <option value="UTC-6">Central Time (UTC-6)</option>
                      <option value="UTC-7">Mountain Time (UTC-7)</option>
                      <option value="UTC-8">Pacific Time (UTC-8)</option>
                      <option value="UTC+2">
                        Eastern European Time (UTC+2)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label>Date Format</label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) =>
                        handleSettingChange("dateFormat", e.target.value)
                      }
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Units</label>
                  <select
                    value={settings.units}
                    onChange={(e) =>
                      handleSettingChange("units", e.target.value)
                    }
                  >
                    <option value="imperial">Imperial (lbs, °F)</option>
                    <option value="metric">Metric (kg, °C)</option>
                  </select>
                </div>
                <div className="danger-zone">
                  <h3>Danger Zone</h3>
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </button>
                </div>
              </section>
            )}
          </div>
        </nav>

        <div className="actions">
          <button className="btn btn-primary btn-save">Save All Changes</button>
        </div>
      </main>
    </div>
  );
}
