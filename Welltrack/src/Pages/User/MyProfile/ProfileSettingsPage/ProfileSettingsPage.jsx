import React, { useState } from "react";
import BtnBack from "../../components/ui/BtnBack/BtnBack";
import NavBar from "../../components/NavBar/NavBar"; // якщо є хедер, або навбар
import "./ProfileSettingsPage.scss";

export default function ProfileSettingsPage() {
  const [settings, setSettings] = useState({
    // Privacy Settings
    profileVisibility: "private",
    shareHealthData: false,
    allowDataAnalytics: true,

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    medicationReminders: true,
    healthTips: false,

    // Security Settings
    twoFactorAuth: false,
    loginAlerts: true,

    // Account Settings
    language: "en",
    timezone: "UTC-5",
    dateFormat: "MM/DD/YYYY",
    units: "imperial",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
        {/* Header секція */}
        <div className="page-header">
          <div className="page-header-text">
            <h1>Profile Settings</h1>
            <p>Manage your account preferences, privacy, and security</p>
          </div>

          <BtnBack />
        </div>

        {/* Таби */}
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

          {/* Контент табів */}
          <div className="tabs-content">
            {activeTab === "privacy" && (
              <section className="tab-section privacy-section">
                <h2>Privacy Settings</h2>
                <p className="section-description">
                  Control how your information is shared and used
                </p>

                <div className="form-group">
                  <label>Profile Visibility</label>
                  <select
                    value={settings.profileVisibility}
                    onChange={(e) =>
                      handleSettingChange("profileVisibility", e.target.value)
                    }
                  >
                    <option value="public">
                      Public - Visible to all users
                    </option>
                    <option value="private">
                      Private - Only visible to you
                    </option>
                    <option value="healthcare">
                      Healthcare providers only
                    </option>
                  </select>
                </div>

                <div className="form-switch">
                  <label htmlFor="shareHealthData">
                    Share Health Data for Research
                    <small>
                      Allow anonymized health data to be used for medical
                      research
                    </small>
                  </label>
                  <input
                    type="checkbox"
                    id="shareHealthData"
                    checked={settings.shareHealthData}
                    onChange={(e) =>
                      handleSettingChange("shareHealthData", e.target.checked)
                    }
                  />
                </div>

                <div className="form-switch">
                  <label htmlFor="allowDataAnalytics">
                    Data Analytics
                    <small>
                      Help improve our services with usage analytics
                    </small>
                  </label>
                  <input
                    type="checkbox"
                    id="allowDataAnalytics"
                    checked={settings.allowDataAnalytics}
                    onChange={(e) =>
                      handleSettingChange(
                        "allowDataAnalytics",
                        e.target.checked
                      )
                    }
                  />
                </div>
              </section>
            )}

            {activeTab === "notifications" && (
              <section className="tab-section notifications-section">
                <h2>Notification Preferences</h2>
                <p className="section-description">
                  Choose how you want to receive notifications
                </p>

                <div className="form-switch">
                  <label htmlFor="emailNotifications">
                    Email Notifications
                  </label>
                  <input
                    type="checkbox"
                    id="emailNotifications"
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
                  <label htmlFor="pushNotifications">Push Notifications</label>
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onChange={(e) =>
                      handleSettingChange("pushNotifications", e.target.checked)
                    }
                  />
                </div>

                <div className="form-switch">
                  <label htmlFor="smsNotifications">SMS Notifications</label>
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onChange={(e) =>
                      handleSettingChange("smsNotifications", e.target.checked)
                    }
                  />
                </div>

                <div className="notification-types">
                  <h3>Notification Types</h3>

                  <div className="form-switch">
                    <label htmlFor="appointmentReminders">
                      Appointment Reminders
                    </label>
                    <input
                      type="checkbox"
                      id="appointmentReminders"
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
                    <label htmlFor="medicationReminders">
                      Medication Reminders
                    </label>
                    <input
                      type="checkbox"
                      id="medicationReminders"
                      checked={settings.medicationReminders}
                      onChange={(e) =>
                        handleSettingChange(
                          "medicationReminders",
                          e.target.checked
                        )
                      }
                    />
                  </div>

                  <div className="form-switch">
                    <label htmlFor="healthTips">Health Tips & Insights</label>
                    <input
                      type="checkbox"
                      id="healthTips"
                      checked={settings.healthTips}
                      onChange={(e) =>
                        handleSettingChange("healthTips", e.target.checked)
                      }
                    />
                  </div>
                </div>
              </section>
            )}

            {activeTab === "security" && (
              <section className="tab-section security-section">
                <h2>Security Settings</h2>
                <p className="section-description">
                  Protect your account with additional security measures
                </p>

                <div className="form-switch">
                  <label htmlFor="twoFactorAuth">
                    Two-Factor Authentication
                  </label>
                  <input
                    type="checkbox"
                    id="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onChange={(e) =>
                      handleSettingChange("twoFactorAuth", e.target.checked)
                    }
                  />
                </div>

                <div className="form-switch">
                  <label htmlFor="loginAlerts">Login Alerts</label>
                  <input
                    type="checkbox"
                    id="loginAlerts"
                    checked={settings.loginAlerts}
                    onChange={(e) =>
                      handleSettingChange("loginAlerts", e.target.checked)
                    }
                  />
                </div>

                <div className="change-password">
                  <h3>Change Password</h3>
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handlePasswordChange}
                  >
                    Update Password
                  </button>
                </div>
              </section>
            )}

            {activeTab === "account" && (
              <section className="tab-section account-section">
                <h2>Account Preferences</h2>
                <p className="section-description">
                  Customize your account settings and preferences
                </p>

                <div className="form-group grid-2cols">
                  <div>
                    <label>Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) =>
                        handleSettingChange("language", e.target.value)
                      }
                    >
                      <option value="en">English</option>
                      <option value="uk">Ukrainian</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>

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
                </div>

                <div className="form-group grid-2cols">
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

                  <div>
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
                </div>

                <div className="danger-zone">
                  <h3>Danger Zone</h3>
                  <p>These actions are permanent and cannot be undone</p>
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

        {/* Save кнопка */}
        <div className="actions">
          <button className="btn btn-primary btn-save">Save All Changes</button>
        </div>
      </main>
    </div>
  );
}
