import React, { useState, useEffect } from "react";
import { Upload, User, Trash2 } from "lucide-react";
import { fetchMe, updateMe } from "../../../../API/accounts"; // імпортуємо API
import "./ProfileCard.scss";

const ProfileCard = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await fetchMe();
        setProfileImage(data.profile_image_url || null); // заміни на своє поле
      } catch (error) {
        setProfileImage(null);
        console.error("Failed to fetch user data", error);
      }
    };

    getUserData();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Непідтримуваний формат. Завантажуйте лише PNG, JPG або JPEG.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert("Файл перевищує 8MB. Будь ласка, оберіть менший файл.");
      return;
    }

    setLoading(true);

    try {
      // Формуємо FormData з файлом
      const formData = new FormData();
      formData.append("profile_image", file); // ім'я поля уточни по API!

      // Відправляємо PATCH запит з FormData
      await updateMe(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Оновлюємо локальний стан, щоб відобразити нове фото
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    } catch (error) {
      alert("Помилка при завантаженні фото.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    setLoading(true);
    try {
      // Відправляємо PATCH з null або порожнім полем
      await updateMe({ profile_image: null });

      setProfileImage(null);
    } catch (error) {
      alert("Не вдалося видалити фото.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-content">
      <div className="profile">
        <div className="avatar-container">
          <div
            className="avatar"
            style={{
              backgroundImage: profileImage ? `url(${profileImage})` : "none",
            }}
          >
            {!profileImage && (
              <div className="avatar-fallback">
                <User size={48} />
              </div>
            )}
          </div>

          <div className="avatar-actions">
            <label
              htmlFor="profile-upload"
              className="upload-btn"
              aria-disabled={loading}
            >
              <Upload size={16} />
            </label>

            {profileImage && (
              <button
                onClick={handleRemoveImage}
                className="remove-btn"
                title="Видалити фото"
                disabled={loading}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <input
            id="profile-upload"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleImageUpload}
            className="hidden-input"
            disabled={loading}
          />
        </div>

        <div className="upload-info">
          <Upload size={16} className="icon" />
          Upload images up to 8 MB (PNG, JPG, JPEG)
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
