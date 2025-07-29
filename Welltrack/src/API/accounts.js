import api from "./api";

export function registerUser(data) {
  return api.post("/accounts/register/", data);
}

export function loginUser(data) {
  return api.post("/accounts/login/", data);
}

export function logoutUser() {
  return api.post("/accounts/logout/");
}

export function fetchProfile() {
  return api.get("/accounts/profile/");
}

export function resetPassword(email) {
  return api.post("/accounts/reset-password/", { email });
}

export function resetPasswordConfirm(data) {
  return api.post("/accounts/reset-password-confirm/", data);
}

export function verifyToken(token) {
  return api.post("/accounts/token/verify/", { token });
}

export function fetchServices() {
  return api.get("/services/");
}

export function fetchRecords() {
  return api.get("/events/");
}

export function addRecord(record) {
  return api.post("/events/", record);
}
