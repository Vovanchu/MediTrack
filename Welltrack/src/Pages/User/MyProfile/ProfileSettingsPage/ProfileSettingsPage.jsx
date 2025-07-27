import { useEffect, useState } from "react";
import axios from "axios";
import "./ProfileSettingsPage.scss";
import BtnBack from "../../components/ui/BtnBack/BtnBack";
import NavBar from "../../components/NavBar/NavBar";

export default function ProfileSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("privacy");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const defaultSettings = {
    profile_visibility: "private",
    share_health_data: false,
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/profile/settings/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        if (res.data && Object.keys(res.data).length > 0) {
          setSettings(res.data);
        } else {
          setSettings(defaultSettings);
        }
        setLoading(false);
      })
      .catch(() => {
        setSettings(defaultSettings);
        setLoading(false);
      });
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    axios
      .patch("http://127.0.0.1:8000/api/profile/settings/", settings, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(() => alert("Settings saved successfully!"))
      .catch(() => alert("Error saving settings"));
  };

  const handlePasswordChange = () => {
    console.log("Password change requested", passwordData);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!settings) return <div className="error">Failed to load settings</div>;

  return (
    <>
      <NavBar />

      <section style={{ backgroundColor: "#e6f2ff" }}>
              <div className="profile-settings">
        <header className="settings-header">
          <div>
            <h1>Profile Settings</h1>
            <p>Manage your account preferences, privacy, and security</p>
            <BtnBack />
          </div>
        </header>

        {/* Tabs */}
        <nav className="tabs">
          <div className="tabs-list">
            {["privacy", "notifications", "security", "account"].map((tab) => (
              <button
                key={tab}
                className={`tabs-trigger ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tabs content */}
          <div className="tabs-content">
            {activeTab === "privacy" && (
              <section className="settings-section">
                <h2>Privacy Settings</h2>
                <p className="section-desc">
                  Control how your information is shared and used
                </p>

                <div className="form-group">
                  <label>Profile Visibility</label>
                  <select
                    value={settings.profile_visibility}
                    onChange={(e) =>
                      handleSettingChange("profile_visibility", e.target.value)
                    }
                  >
                    <option value="public">Public - Visible to all</option>
                    <option value="private">Private - Only you</option>
                    <option value="healthcare">
                      Healthcare providers only
                    </option>
                  </select>
                </div>

                <div className="form-switch">
                  <label>
                    <span>Share Health Data</span>
                    <small>Allow anonymized data for research</small>
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.share_health_data}
                    onChange={(e) =>
                      handleSettingChange("share_health_data", e.target.checked)
                    }
                  />
                </div>
              </section>
            )}

            {activeTab === "notifications" && (
              <section className="settings-section">
                <h2>Notifications</h2>
                <p className="section-desc">
                  Manage your notification preferences
                </p>

                <div className="form-switch">
                  <label>Email Notifications</label>
                  <input
                    type="checkbox"
                    checked={settings.email_notifications}
                    onChange={(e) =>
                      handleSettingChange(
                        "email_notifications",
                        e.target.checked
                      )
                    }
                  />
                </div>

                <div className="form-switch">
                  <label>Push Notifications</label>
                  <input
                    type="checkbox"
                    checked={settings.push_notifications}
                    onChange={(e) =>
                      handleSettingChange(
                        "push_notifications",
                        e.target.checked
                      )
                    }
                  />
                </div>

                <div className="form-switch">
                  <label>SMS Notifications</label>
                  <input
                    type="checkbox"
                    checked={settings.sms_notifications}
                    onChange={(e) =>
                      handleSettingChange("sms_notifications", e.target.checked)
                    }
                  />
                </div>
              </section>
            )}

            {activeTab === "security" && (
              <section className="settings-section">
                <h2>Security</h2>
                <p className="section-desc">
                  Manage your security settings, including password change
                </p>

                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
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
                  <label>New Password</label>
                  <input
                    type="password"
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
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <button className="btn primary" onClick={handlePasswordChange}>
                  Update Password
                </button>
              </section>
            )}

            {activeTab === "account" && (
              <section className="settings-section">
                <h2>Account</h2>
                <p className="section-desc">
                  Manage your account details and preferences
                </p>

                <div className="danger-zone">
                  <h3>Danger Zone</h3>
                  <p className="danger-desc">
                    These actions are irreversible. Please proceed with caution.
                  </p>

                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to DELETE your account? This action cannot be undone."
                        )
                      ) {
                        // TODO: додай API-запит на видалення акаунту
                        alert("Account deletion requested");
                      }
                    }}
                  >
                    Delete Account
                  </button>

                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to DISABLE your account? You can reactivate it later."
                        )
                      ) {
                        // TODO: додай API-запит на відключення акаунту
                        alert("Account disable requested");
                      }
                    }}
                  >
                    Disable Account
                  </button>
                </div>
              </section>
            )}
          </div>
        </nav>

        <div className="actions">
          <button className="btn save" onClick={saveSettings}>
            Save All Changes
          </button>
        </div>
      </div>
      </section>
    </>
  );
}
