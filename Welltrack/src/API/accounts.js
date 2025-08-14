import api from "./api";

/* =================== AUTH =================== */

// Реєстрація нового користувача
export function registerUser(data) {
  return api.post("/accounts/register/", data);
}

// Вхід користувача
export function loginUser(data) {
  return api.post("/accounts/login/", data);
}

// Вихід користувача
export function logoutUser() {
  return api.post("/accounts/logout/");
}

// Перевірка токена
export function verifyToken(token) {
  return api.post("/accounts/token/verify/", { token });
}

/* ============ PASSWORD RECOVERY ============ */

// Запит на скидання паролю
export async function resetPassword(email) {
  const response = await fetch(
    "https://dr-reminder-backend-test.onrender.com/api/accounts/reset-password/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
}

// Підтвердження скидання паролю
export function resetPasswordConfirm(data) {
  return api.post("/accounts/reset-password-confirm/", data);
}

/* ============== USER PROFILE ============== */

// Отримати профіль користувача
export function fetchProfile() {
  return api.get("/accounts/profile/");
}

// Оновити або створити профіль
export function updateOrCreateProfile(data) {
  return api.post("/accounts/profile/", data);
}

// Отримати поточного користувача
export function fetchMe() {
  const token = localStorage.getItem("accessToken");
  return api.get("/accounts/me/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Оновити поточного користувача (часткове оновлення, включно з фото)
export function updateMe(data) {
  const formData = new FormData();

  for (const key in data) {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  }

  return api.patch("/accounts/me/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// Оновити поточного користувача (часткове оновлення, без фото)
export function patchMe(data) {
  return api.patch("/accounts/me/", data);
}

// Отримати поточного користувача
export function fetchHealthIndicators() {
  return api.get("/accounts/health-indicators/");
}

// Оновити поточного користувача
export const updateHealthIndicators = async (data) => {
  try {
    const response = await api.post("/accounts/health-indicators/", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data);
    throw error;
  }
};

/* ============== SERVICES ================== */

// Отримати список доступних сервісів
export function fetchServices() {
  return api.get("/services/");
}

/* ============== EVENTS ==================== */

// Отримати всі записи подій (вакцинація, візити тощо)
export async function fetchRecords() {
  try {
    const response = await api.get("/services/events/");

    if (response.status === 401) {
      throw new Error("Unauthorized");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
}

// Додати новий запис (подію)
export function addRecord(data) {
  return api.post("/services/events/", data);
}

export function deleteRecord(id) {
  return api.delete(`/services/events/${id}/`);
}

/* ============== VACCINATIONS ============== */

// Отримати всі записи про вакцинацію
export function fetchVaccinations() {
  return api.get("/services/vaccinations/");
}

/* ============== DOCTOR VISITS ============= */

// Отримати всі спеціальності лікарів
export function fetchDoctorVisits() {
  return api.get("/services/medical-specialties/");
}
