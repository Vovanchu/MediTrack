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
export function resetPassword(email) {
  return api.post("/accounts/reset-password/", { email });
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

// Отримати поточного користувача (коротка інфа)
export function fetchMe() {
  return api.get("/accounts/me/");
}

/* ============== SERVICES ================== */

// Отримати список доступних сервісів
export function fetchServices() {
  return api.get("/services/");
}

/* ============== EVENTS ==================== */

// Отримати всі записи подій (вакцинація, візити тощо)
export function fetchRecords() {
  return api.get("/services/events/");
}

// Додати новий запис (подію)
export function addRecord(record) {
  return api.post("/services/events/", record);
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
