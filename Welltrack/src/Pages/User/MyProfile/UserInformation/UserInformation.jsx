import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar/NavBar";
import BtnBack from "../../components/ui/BtnBack/BtnBack";
import Footer from "../../components/Footer/Footer";
import Swal from "sweetalert2";
import { fetchMe, updateMe } from "../../../../API/accounts";
import "./UserInformation.scss";

// Покращена функція валідації телефону
const validatePhone = (phone) => {
  const cleaned = phone.replace(/[^\d+]/g, "");
  const patterns = [
    /^\+380\d{9}$/, // +380XXXXXXXXX
    /^380\d{9}$/, // 380XXXXXXXXX
    /^0\d{9}$/, // 0XXXXXXXXX
  ];
  return patterns.some((pattern) => pattern.test(cleaned));
};

// Функція форматування телефону для відображення
const formatPhoneDisplay = (phone) => {
  if (!phone) return "";
  const cleaned = phone.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+380") && cleaned.length === 13) {
    return `+380 ${cleaned.slice(4, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(
      9,
      11
    )} ${cleaned.slice(11)}`;
  }
  return phone;
};

// Функція нормалізації телефону для API
const normalizePhoneForAPI = (phone) => {
  if (!phone) return "";
  let cleaned = phone.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "+380" + cleaned.slice(1);
  } else if (cleaned.startsWith("380") && cleaned.length === 12) {
    cleaned = "+" + cleaned;
  } else if (!cleaned.startsWith("+") && cleaned.length === 9) {
    cleaned = "+380" + cleaned;
  }

  return cleaned;
};

// Компонент для введення телефону (адаптований під ваш стиль)
const PhoneInputField = ({ value, onChange, disabled }) => {
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatPhoneDisplay(value));
    }
  }, [value, isFocused]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setDisplayValue(input);
    const normalized = normalizePhoneForAPI(input);
    onChange(normalized);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(value || "+380");
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (value) {
      setDisplayValue(formatPhoneDisplay(value));
    }
  };

  return (
    <input
      type="tel"
      className="edit-input phone-input"
      value={displayValue}
      onChange={handleInputChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      placeholder="+380 XX XXX XX XX"
      autoComplete="tel"
    />
  );
};

const validateFields = (data, section) => {
  const errors = {};

  if (section === "left") {
    if (!data.username?.trim()) errors.username = "Username is required.";

    if (!data.phone?.trim()) {
      errors.phone = "Phone is required.";
    } else if (!validatePhone(data.phone)) {
      errors.phone = "Invalid phone format. Use +380XXXXXXXXX or 0XXXXXXXXX";
    }

    if (!data.country?.trim()) {
      errors.country = "Country is required.";
    } else if (/[^a-zA-Zа-яА-ЯїЇіІєЄ\s'-]/.test(data.country)) {
      errors.country = "Country should contain only letters.";
    }

    if (!data.city?.trim()) {
      errors.city = "City/Village is required.";
    } else if (/[^a-zA-Zа-яА-ЯїЇіІєЄ\s'-]/.test(data.city)) {
      errors.city = "City should contain only letters.";
    }

    if (!data.sex) {
      errors.sex = "Sex is required.";
    } else if (!["male", "female"].includes(data.sex)) {
      errors.sex = "Sex must be 'male' or 'female'.";
    }

    if (!data.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required.";
    } else {
      const today = new Date();
      const birthDate = new Date(data.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();

      if (birthDate > today) {
        errors.dateOfBirth = "Date of birth cannot be in the future.";
      } else if (age > 120) {
        errors.dateOfBirth = "Please enter a valid date of birth.";
      }
    }
  }

  if (section === "right") {
    if (!data.phone?.trim()) {
      errors.phone = "Phone is required.";
    } else if (!validatePhone(data.phone)) {
      errors.phone = "Invalid phone format. Use +380XXXXXXXXX or 0XXXXXXXXX";
    }

    if (!data.email?.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
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
    const getUserData = async () => {
      try {
        setLoading(true);
        const { data } = await fetchMe();

        let phone = data.phone_number || "";
        if (phone) {
          phone = normalizePhoneForAPI(phone);
        }

        setUserData({
          username: data.username || "",
          phone,
          dateOfBirth: data.birth_date || "",
          sex: data.sex || "",
          country: data.country || "",
          city: data.city || "",
          email: data.email || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load user data",
        });
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleEdit = async (section) => {
    if (
      (section === "left" && editLeft) ||
      (section === "right" && editRight)
    ) {
      // Валідація перед збереженням
      const newErrors = validateFields(userData, section);
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

      try {
        setLoading(true);

        let updateData = {};

        if (section === "left") {
          updateData = {
            username: userData.username,
            phone: normalizePhoneForAPI(userData.phone),
            date_of_birth: userData.dateOfBirth,
            sex: userData.sex,
            country: userData.country,
            city: userData.city,
          };
        } else if (section === "right") {
          updateData = {
            phone: normalizePhoneForAPI(userData.phone),
            email: userData.email,
          };
        }

        await updateMe(updateData);

        Swal.fire({
          icon: "success",
          title: "Saved",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error updating user data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to save changes",
        });
      } finally {
        setLoading(false);
      }
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
            value="male"
            checked={userData?.sex === "male"}
            onChange={(e) => handleChange("sex", e.target.value)}
            autoComplete="sex"
          />
          Male
        </label>
        <label>
          <input
            type="radio"
            name="sex"
            value="female"
            checked={userData?.sex === "female"}
            onChange={(e) => handleChange("sex", e.target.value)}
            autoComplete="sex"
          />
          Female
        </label>
      </div>
    );
  };

  const renderField = (label, field, type = "text", editMode) => {
    const autocompleteMap = {
      username: "username",
      email: "email",
      dateOfBirth: "bday",
      country: "country-name",
      city: "address-level2",
    };

    return (
      <li key={field}>
        <strong>{label}</strong>
        {editMode ? (
          <input
            className="edit-input"
            type={type}
            value={userData?.[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            disabled={loading}
            autoComplete={autocompleteMap[field] || "off"}
          />
        ) : (
          <span>{userData?.[field] || "Not specified"}</span>
        )}
      </li>
    );
  };

  const renderPhoneField = (editMode, side) => {
    return (
      <li key={`phone-${side}`}>
        <strong>Phone Number</strong>
        {editMode ? (
          <PhoneInputField
            value={userData?.phone || ""}
            onChange={(value) => handleChange("phone", value)}
            disabled={loading}
          />
        ) : (
          <span className="phone-display">
            {formatPhoneDisplay(userData?.phone) || "Not specified"}
          </span>
        )}
      </li>
    );
  };

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
                disabled={loading}
              >
                {editLeft ? "Save" : "Change"}
              </button>
              <ul className="user-details">
                {renderField("Username", "username", "text", editLeft)}
                {renderPhoneField(editLeft, "left")}
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
                disabled={loading}
              >
                {editRight ? "Save" : "Change"}
              </button>
              <ul className="user-details">
                {renderPhoneField(editRight, "right")}
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
