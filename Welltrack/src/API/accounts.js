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

// Отримати профіль користувача (по токену)
export function fetchUserProfile(token) {
  return api.get("/profile/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
