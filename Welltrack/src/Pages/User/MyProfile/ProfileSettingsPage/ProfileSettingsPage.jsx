import React, { useState, useEffect } from "react";
import BtnBack from "../../components/ui/BtnBack/BtnBack";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import "./ProfileSettingsPage.scss";
import { Eye, EyeOff, Check, X } from "lucide-react";
import {
  fetchSettings,
  updateSettings,
  changePassword,
  deleteAccount,
} from "../../../..//API/accounts";
import Swal from "sweetalert2";

export default function ProfileSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [activeTab, setActiveTab] = useState("privacy");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const mapFromApi = (data) => ({
    profileVisibility: data.profile_visibility,
    emailNotifications: data.email_notifications,
    pushNotifications: data.push_notifications,
    smsNotifications: data.sms_notifications,
    appointmentReminders: data.appointment_notifications,
    medicationReminders: data.medication_reminders,
    timezone: data.timezone,
    dateFormat: data.date_format,
    units: data.units,
    twoFactorAuth: data.two_factor_enabled,
  });

  const mapToApi = (data) => ({
    profile_visibility: data.profileVisibility,
    email_notifications: data.emailNotifications,
    push_notifications: data.pushNotifications,
    sms_notifications: data.smsNotifications,
    appointment_notifications: data.appointmentReminders,
    medication_reminders: data.medicationReminders,
    timezone: data.timezone,
    date_format: data.dateFormat,
    units: data.units,
    two_factor_enabled: data.twoFactorAuth,
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetchSettings();
        console.log("Loaded settings from API:", response.data);
        setSettings(mapFromApi(response.data));
      } catch (error) {
        console.error("Error loading settings:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load settings. Please try again.",
          confirmButtonColor: "#3085d6",
        });
      }
    };
    loadSettings();
  }, []);

  if (!settings) {
    return (
      <div className="profile-settings-page">
        <NavBar />
        <main className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
              fontSize: "18px",
              color: "#666",
            }}
          >
            Loading settings...
          </div>
        </main>
      </div>
    );
  }

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const passwordValidation = {
    length: passwordData.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(passwordData.newPassword),
    number: /[0-9]/.test(passwordData.newPassword),
    special: /[!@#$%^&*]/.test(passwordData.newPassword),
    match:
      passwordData.newPassword === passwordData.confirmPassword &&
      passwordData.newPassword.length > 0,
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = async () => {
    try {
      await changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        confirm_password: passwordData.confirmPassword,
      });

      console.log("Password change requested", {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });

      // очищаємо форму
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Password has been updated successfully.",
        confirmButtonColor: "#22c55e",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update password. Please check your current password and try again.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone! Your account and all data will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete my account",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteAccount();

        Swal.fire({
          icon: "success",
          title: "Account Deleted",
          text: "Your account has been successfully deleted.",
          confirmButtonColor: "#ef4444",
        });

        window.location.href = "/login";
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  const handleSave = async () => {
    try {
      // Перетворюємо дані у формат, який очікує API
      const apiData = mapToApi(settings);
      console.log("Sending data to API:", apiData);

      const response = await updateSettings(apiData);
      console.log("Settings updated successfully:", response);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Your settings have been saved successfully.",
        confirmButtonColor: "#22c55e",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Error saving settings:", error);

      let errorMessage = "Could not save settings. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Your session has expired. Please log in again.";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid settings data. Please check your input.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <>
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
              {["privacy", "notifications", "security", "account"].map(
                (tab) => (
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
                )
              )}
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
                        handleSettingChange(
                          "pushNotifications",
                          e.target.checked
                        )
                      }
                    />
                  </div>
                  <div className="form-switch">
                    <label>SMS Notifications</label>
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) =>
                        handleSettingChange(
                          "smsNotifications",
                          e.target.checked
                        )
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
                        onCopy={(e) => e.preventDefault()}
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
                        onCopy={(e) => e.preventDefault()}
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
                        className={
                          passwordValidation.match ? "valid" : "invalid"
                        }
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
                        onCopy={(e) => e.preventDefault()}
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
                        <option value="America/New_York">
                          Eastern Time (UTC-5)
                        </option>
                        <option value="America/Chicago">
                          Central Time (UTC-6)
                        </option>
                        <option value="America/Denver">
                          Mountain Time (UTC-7)
                        </option>
                        <option value="America/Los_Angeles">
                          Pacific Time (UTC-8)
                        </option>
                        <option value="Europe/Kyiv">Kyiv Time (UTC+2)</option>
                        <option value="Europe/London">
                          London Time (UTC+0)
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
            <button className="btn btn-primary btn-save" onClick={handleSave}>
              Save All Changes
            </button>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
