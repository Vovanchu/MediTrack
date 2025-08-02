import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar/NavBar";
import BtnBack from "../../components/ui/BtnBack/BtnBack";
import Footer from "../../components/Footer/Footer";
import Swal from "sweetalert2";
import "./UserInformation.scss";

const fakeProfile = {
  username: "johndoe",
  phone: "+380991234567",
  dateOfBirth: "1990-01-01",
  sex: "Male",
  country: "Ukraine",
  city: "Kyiv",
  email: "johndoe@example.com",
};

const validateFields = (data, section) => {
  const errors = {};

  if (section === "left") {
    if (!data.username?.trim()) errors.username = "Username is required.";

    if (!data.phone?.trim()) {
      errors.phone = "Phone is required.";
    } else if (!/^\+\d{12}$/.test(data.phone)) {
      errors.phone = "Phone must be 12 digits and start with '+'.";
    }

    if (!data.country?.trim()) {
      errors.country = "Country is required.";
    } else if (/[^a-zA-Z\s]/.test(data.country)) {
      errors.country = "Country should not contain digits or symbols.";
    }

    if (!data.city?.trim()) {
      errors.city = "City/Village is required.";
    } else if (/[^a-zA-Z\s]/.test(data.city)) {
      errors.city = "City should not contain digits or symbols.";
    }

    if (!data.sex) {
      errors.sex = "Sex is required.";
    } else if (!["Male", "Female"].includes(data.sex)) {
      errors.sex = "Sex must be 'Male' or 'Female'.";
    }

    if (!data.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required.";
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (data.dateOfBirth > today) {
        errors.dateOfBirth = "Date of birth cannot be in the future.";
      }
    }
  }

  if (section === "right") {
    if (!data.phone?.trim()) {
      errors.phone = "Phone is required.";
    } else if (!/^\+\d{12}$/.test(data.phone)) {
      errors.phone = "Phone must be 12 digits and start with '+'.";
    }

    if (!data.email?.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$/.test(data.email)) {
      errors.email = "Invalid email format.";
    }
  }

  return errors;
};

export default function UserInformation() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editLeft, setEditLeft] = useState(false);
  const [editRight, setEditRight] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      localStorage.setItem("accessToken", "mocked-token");
    }

    setTimeout(() => {
      setUserData(fakeProfile);
      setLoading(false);
    }, 500);
  }, []);

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleEdit = (section) => {
    if (section === "left" && editLeft) {
      const newErrors = validateFields(userData, "left");
      if (Object.keys(newErrors).length) {
        const messages = Object.values(newErrors).join("<br>");
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          html: messages,
          confirmButtonColor: "#3085d6",
        });
        return;
      }
      console.log("Saving LEFT:", userData);
    }

    if (section === "right" && editRight) {
      const newErrors = validateFields(userData, "right");
      if (Object.keys(newErrors).length) {
        const messages = Object.values(newErrors).join("<br>");
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          html: messages,
          confirmButtonColor: "#3085d6",
        });
        return;
      }
      console.log("Saving RIGHT:", userData);
    }

    section === "left" ? setEditLeft(!editLeft) : setEditRight(!editRight);
  };

  const renderSexField = (editMode) => {
    if (!editMode) return <span>{userData?.sex || "Not specified"}</span>;

    return (
      <div className="sex-radio-group">
        <label>
          <input
            type="radio"
            name="sex"
            value="Male"
            checked={userData?.sex === "Male"}
            onChange={(e) => handleChange("sex", e.target.value)}
          />
          Male
        </label>
        <label>
          <input
            type="radio"
            name="sex"
            value="Female"
            checked={userData?.sex === "Female"}
            onChange={(e) => handleChange("sex", e.target.value)}
          />
          Female
        </label>
      </div>
    );
  };

  const renderField = (label, field, type = "text", editMode) => (
    <li key={field}>
      <strong>{label}</strong>
      {editMode ? (
        <input
          className="edit-input"
          type={type}
          value={userData?.[field] || ""}
          onChange={(e) => handleChange(field, e.target.value)}
        />
      ) : (
        <span>{userData?.[field] || "..."}</span>
      )}
    </li>
  );

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <NavBar />
      <section style={{ backgroundColor: "#e6f2ff" }}>
        <div className="user-info-container">
          <div className="user-info-header">
            <div className="user-info-header__text">
              <h1 className="user-info-title">Personal Information</h1>
              <p className="user-info-description">
                Manage your personal details and contact information
              </p>
            </div>
            <BtnBack />
          </div>

          <div className="user-sections-wrapper">
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

                <li key="sex">
                  <strong>Sex</strong>
                  {renderSexField(editLeft)}
                </li>

                {renderField("Country", "country", "text", editLeft)}
                {renderField("City/Village", "city", "text", editLeft)}
              </ul>
            </div>

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
