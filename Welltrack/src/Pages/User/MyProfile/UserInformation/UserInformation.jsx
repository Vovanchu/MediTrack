import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserInformation.scss";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import BtnBack from "../../components/ui/BtnBack/BtnBack";

export default function UserInformation() {
  const navigate = useNavigate();

  // Стани для кожної секції окремо
  const [editLeft, setEditLeft] = useState(false);
  const [editRight, setEditRight] = useState(false);

  const [userData, setUserData] = useState({
    username: "johndoe",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    sex: "Male",
    country: "United States",
    city: "New York",
    email: "john.doe@example.com",
  });

  const handleChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleToggleEdit = (section) => {
    if (section === "left") {
      if (editLeft) console.log("Saving left section:", userData);
      setEditLeft(!editLeft);
    } else {
      if (editRight) console.log("Saving right section:", userData);
      setEditRight(!editRight);
    }
  };

  const renderField = (label, field, type = "text", editMode) => (
    <li>
      <strong>{label}</strong>
      {editMode ? (
        <input
          className="edit-input"
          type={type}
          value={userData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
        />
      ) : (
        <span>{userData[field]}</span>
      )}
    </li>
  );

  return (
    <>
      <NavBar />
      <section style={{ backgroundColor: "#e6f2ff" }}>
        <div className="user-info-container">
          {/* Заголовок */}
          <div className="user-info-header">
            <div className="user-info-header__text">
              <h1 className="user-info-title">Personal Information</h1>
              <p className="user-info-description">
                Manage your personal details and contact information
              </p>
            </div>
            <BtnBack />
          </div>

          {/* Дві колонки */}
          <div className="user-sections-wrapper">
            {/* Ліва колонка (персональні дані) */}
            <div className="user-section">
              <h2 className="section-title">Your basic personal details</h2>
              <button
                className="btn-change"
                onClick={() => handleToggleEdit("left")}
              >
                {editLeft ? "Save" : "Change"}
              </button>
              <ul className="user-details">
                {renderField("Username", "username", "text", editLeft)}
                {renderField("Phone Number", "phone", "text", editLeft)}
                {renderField("Date of Birth", "dateOfBirth", "date", editLeft)}
                {renderField("Sex", "sex", "text", editLeft)}
                {renderField("Country", "country", "text", editLeft)}
                {renderField("City", "city", "text", editLeft)}
              </ul>
            </div>

            {/* Права колонка (контактна інфа) */}
            <div className="user-section">
              <h2 className="section-title">Contact Information</h2>
              <button
                className="btn-change"
                onClick={() => handleToggleEdit("right")}
              >
                {editRight ? "Save" : "Change"}
              </button>
              <ul className="user-details">
                {renderField("Phone", "phone", "text", editRight)}
                {renderField("Email", "email", "email", editRight)}
              </ul>
              <p className="info-note">
                We'll use this information to send you appointment reminders and
                important health updates.
              </p>
            </div>
          </div>

          {/* Privacy */}
          <div className="privacy-note">
            <h3>Privacy & Security</h3>
            <p>
              Your personal information is encrypted and securely stored. We
              never share your data with third parties without your explicit
              consent. You can update or delete your information at any time.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
