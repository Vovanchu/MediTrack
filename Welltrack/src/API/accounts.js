import api from "./api";

/* =================== AUTH =================== */

// Реєстрація нового користувача
export const registerUser = (data) => api.post("/accounts/register/", data);

// Вхід користувача
export const loginUser = (data) => api.post("/accounts/login/", data);

// Вихід користувача
export const logoutUser = () => api.post("/accounts/logout/");

// Перевірка токена
export const verifyToken = (token) =>
  api.post("/accounts/token/verify/", { token });

/* ============ PASSWORD RECOVERY ============ */

// Запит на скидання паролю
export const resetPassword = async (email) => {
  const response = await fetch(
    "https://dr-reminder-backend-test.onrender.com/api/accounts/reset-password/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error("Error resetting password");
    error.response = { data: errorData };
    throw error;
  }

  return response.json();
};

// Підтвердження скидання паролю
export const resetPasswordConfirm = (data) =>
  api.post("/accounts/reset-password-confirm/", data);

/* ============== USER PROFILE ============== */

// Отримати профіль користувача
export const fetchProfile = () => api.get("/accounts/profile/");

// Створити або оновити профіль
export const updateOrCreateProfile = (data) =>
  api.post("/accounts/profile/", data);

// Отримати поточного користувача
export const fetchMe = () => {
  const token = localStorage.getItem("accessToken");
  return api.get("/accounts/me/", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Часткове оновлення користувача з фото
export const updateMe = (formData) => {
  return api.patch("/accounts/me/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Видалити фото профілю
export const deleteProfileImage = () => {
  return api.delete("/accounts/me/photo/");
};

/* ============== HEALTH INDICATORS ============== */

export const fetchHealthIndicators = () =>
  api.get("/accounts/health-indicators/");

export const updateHealthIndicators = async (data) => {
  try {
    const response = await api.post("/accounts/health-indicators/", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data);
    throw error;
  }
};

/* ============== MEDICAL DOCUMENTS ================== */

// Отримати всі медичні документи користувача
export const fetchMedicalDocuments = () =>
  api.get("/accounts/medical-documents/");

// Додати новий медичний документ
export const addMedicalDocument = (formData) =>
  api.post("/accounts/medical-documents/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Часткове оновлення документа
export const updateMedicalDocument = (id, formData) =>
  api.patch(`/accounts/medical-documents/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Видалити медичний документ
export const deleteMedicalDocument = (id) =>
  api.delete(`/accounts/medical-documents/${id}/`);

/* ============== SERVICES ================== */

// Отримати список доступних сервісів
export const fetchServices = () => api.get("/services/");

/* ============== EVENTS ==================== */

// Отримати всі записи подій
export const fetchRecords = async () => {
  try {
    const response = await api.get("/services/events/");
    if (response.status === 401) throw new Error("Unauthorized");
    return response.data;
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

// Додати нову подію
export const addRecord = (data) => api.post("/services/events/", data);

// Видалити подію
export const deleteRecord = (id) => api.delete(`/services/events/${id}/`);

/* ============== VACCINATIONS ================== */

// Отримати всі записи про вакцинацію
export const fetchVaccinations = () => api.get("/services/vaccinations/");

/* ============== DOCTOR VISITS ================== */

// Отримати всі спеціальності лікарів
export const fetchDoctorVisits = () =>
  api.get("/services/medical-specialties/");

/* ============== TREATMENT PLANS ================== */

// accounts.js
export const addMedication = (data) =>
  api.post("/services/treatment-plans/", data);

export const fetchMedications = () =>
  api.get("/services/treatment-plans/").then((res) => res.data);

// Видалити план за ID
export const deleteMedication = (id) =>
  api.delete(`/services/treatment-plans/${id}/`);

/* ============== BLOOD PRESSURE ================== */

export const fetchBloodCenters = () =>
  api.get("/services/donation-centers/").then((res) => res.data);
