import api from "./api"; 

// Отримати список акаунтів (тільки якщо тобі треба для тесту)
export function fetchAccounts() {
  return api.get("/");
}

// Реєстрація нового користувача
export function registerUser(data) {
  return api.post("/register/", data);
}

// Логін користувача
export function loginUser(data) {
  return api.post("/login/", data);
}

// Отримати всі події (health records)
export function fetchRecords() {
  return api.get("/events/"); // => http://127.0.0.1:8001/api/events/
}

// Додати новий запис
export function addRecord(record) {
  return api.post("/events/", record); // axios автоматично додасть токен
}