import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateOrCreateProfile } from "../../../API/accounts";
import Swal from "sweetalert2";
import "./CompleteProfile.scss";
import BtnBack from "../components/BtnBack/BtnBack";

export default function CompleteProfile() {
  const [formData, setFormData] = useState({
    username: "user",
    phone_number: "",
    birth_date: "",
    sex: "male",
    country: "",
    city: "",
    image_profile: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required.";
    } else {
      const phoneRegex = /^\+?[0-9]{7,15}$/;
      if (!phoneRegex.test(formData.phone_number)) {
        newErrors.phone_number =
          "Phone must contain only digits and can start with +.";
      }
    }

    if (!formData.birth_date) {
      newErrors.birth_date = "Birth date is required.";
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (formData.birth_date > today) {
        newErrors.birth_date = "Birth date cannot be in the future.";
      }
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, image_profile: file }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      const errorList = Object.entries(validationErrors)
        .map(([key, msg]) => `${key}: ${msg}`)
        .join("<br>");

      Swal.fire({
        icon: "error",
        title: "Validation Error",
        html: errorList,
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataToSend.append(key, value);
        }
      });

      await updateOrCreateProfile(formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Your profile was updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/my-profile"), 1500);
    } catch (err) {
      console.error("Failed to update profile:", err);

      const errorMessage =
        err.response?.data && typeof err.response.data === "object"
          ? Object.entries(err.response.data)
              .map(
                ([key, value]) =>
                  `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
              )
              .join("\n")
          : "Failed to update profile. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: errorMessage,
      });
    }
  };

  return (
    <section className="complete-profile">
      <h2>Complete Your Profile</h2>

      <BtnBack />
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Username*
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </label>

        <label>
          Phone Number*
          <input
            type="tel"
            name="phone_number"
            placeholder="+380501234567"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
          {errors.phone_number && (
            <span className="error">{errors.phone_number}</span>
          )}
        </label>

        <label>
          Birth Date*
          <input
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            required
          />
          {errors.birth_date && (
            <span className="error">{errors.birth_date}</span>
          )}
        </label>

        <label>
          Sex
          <select name="sex" value={formData.sex} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>

        <label>
          Country*
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            placeholder="Country"
          />
          {errors.country && <span className="error">{errors.country}</span>}
        </label>

        <label>
          City*
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder="City/Village"
          />
          {errors.city && <span className="error">{errors.city}</span>}
        </label>

        <label>
          Profile Image
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="image-preview"
              width={120}
            />
          )}
        </label>

        <button type="submit">Save and Continue</button>
      </form>
    </section>
  );
}
