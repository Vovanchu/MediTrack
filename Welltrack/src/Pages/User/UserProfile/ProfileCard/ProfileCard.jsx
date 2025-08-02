import React, { useState, useEffect } from "react";
import { Upload, User, Trash2 } from "lucide-react"; // додали Trash2
import "./ProfileCard.scss";

const ProfileCard = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setEmail(parsed.email || "No email");
      } catch {
        setEmail("No email");
      }
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

      if (!allowedTypes.includes(file.type)) {
        alert("Непідтримуваний формат. Завантажуйте лише PNG, JPG або JPEG.");
        return;
      }

      if (file.size > 8 * 1024 * 1024) {
        alert("Файл перевищує 8MB. Будь ласка, оберіть менший файл.");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  return (
    <div className="card-content">
      <div className="profile">
        {/* Аватар */}
        <div className="avatar-container">
          <div
            className="avatar"
            style={{ backgroundImage: `url(${profileImage})` }}
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" />
            ) : (
              <div className="avatar-fallback">
                <User size={48} />
              </div>
            )}
          </div>

          <div className="avatar-actions">
            <label htmlFor="profile-upload" className="upload-btn">
              <Upload size={16} />
            </label>
            {profileImage && (
              <button
                onClick={handleRemoveImage}
                className="remove-btn"
                title="Видалити фото"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden-input"
          />
        </div>

        {/* Інформація про користувача */}
        <h2 className="username">{email}</h2>

        <div className="upload-info">
          <Upload size={16} className="icon" />
          Upload images up to 8 MB (PNG, JPG, JPEG)
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
