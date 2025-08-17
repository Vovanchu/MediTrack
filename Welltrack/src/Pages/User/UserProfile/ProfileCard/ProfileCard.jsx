import React, { useState, useEffect } from "react";
import { Upload, User, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import {
  fetchMe,
  updateMe,
  deleteProfileImage,
} from "../../../../API/accounts";
import "./ProfileCard.scss";

const ProfileCard = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await fetchMe();
        setUserData(data); // зберігаємо дані користувача
        if (data.image_profile) {
          setProfileImage(`${data.image_profile}?t=${Date.now()}`);
        } else {
          setProfileImage(null);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        Swal.fire(
          "Помилка",
          "Не вдалося завантажити дані користувача",
          "error"
        );
      }
    };

    loadUser();
  }, []);

  const updateProfileImage = (imageUrl) => {
    if (imageUrl) {
      setProfileImage(`${imageUrl}?t=${Date.now()}`);
    } else {
      setProfileImage(null);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image_profile", file);

    const tempUrl = URL.createObjectURL(file);
    setProfileImage(tempUrl);

    try {
      await updateMe(formData);
      const { data } = await fetchMe();
      updateProfileImage(data.image_profile);
      Swal.fire("Успіх", "Фото успішно завантажено", "success");
    } catch (error) {
      console.error("Upload failed:", error);
      setProfileImage(tempUrl);
      Swal.fire("Помилка", "Не вдалося завантажити фото", "error");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire("Помилка", "Непідтримуваний формат. PNG, JPG, JPEG.", "error");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      Swal.fire("Помилка", "Файл більше 8MB.", "error");
      return;
    }

    setLoading(true);
    try {
      await uploadImage(file);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = async () => {
    const result = await Swal.fire({
      title: "Видалити фото профілю?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Так",
      cancelButtonText: "Ні",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await deleteProfileImage();
      updateProfileImage(null);
      const { data } = await fetchMe();
      setUserData(data);
      Swal.fire("Успіх", "Фото видалено", "success");
    } catch (error) {
      console.error("DELETE failed, trying fallback:", error);
      try {
        await updateMe({ image_profile: null });
        updateProfileImage(null);
        const { data } = await fetchMe();
        setUserData(data);
        Swal.fire("Успіх", "Фото видалено (fallback)", "success");
      } catch (patchError) {
        console.error("Fallback PATCH failed:", patchError);
        Swal.fire("Помилка", "Не вдалося видалити фото", "error");
      }
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
              backgroundSize: "cover",
              backgroundPosition: "center",
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
              className={`upload-btn ${loading ? "disabled" : ""}`}
              title="Upload new photo"
            >
              <Upload size={16} />
              <input
                id="profile-upload"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageChange}
                className="hidden-input"
                disabled={loading}
              />
            </label>

            {profileImage && (
              <button
                onClick={handleRemoveImage}
                className="remove-btn"
                disabled={loading}
                title="Remove photo"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="upload-info">
          <Upload size={16} className="icon" />
          {loading ? "Uploading..." : "Max 8MB (PNG, JPG)"}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
