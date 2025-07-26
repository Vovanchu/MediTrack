import React, { useState, useEffect } from "react";
import { Upload, User } from "lucide-react";
import "./ProfileCard.scss";

const ProfileCard = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Дістаємо дані користувача з localStorage
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
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="card-content">
      <div className="profile">
        {/* Аватар */}
        <div className="avatar-container">
          <div className="avatar">
            {profileImage ? (
              <img src={profileImage} alt="Profile" />
            ) : (
              <div className="avatar-fallback">
                <User size={48} />
              </div>
            )}
          </div>
          <label htmlFor="profile-upload" className="upload-btn">
            <Upload size={16} />
          </label>
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
