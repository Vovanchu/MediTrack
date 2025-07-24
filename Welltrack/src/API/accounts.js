import api from "./api"; 

export function fetchAccounts() {
  return api.get("/");
}

export function registerUser(data) {
  return api.post("register/", data);
}

export function loginUser(data) {
  return api.post("login/", data);
}

export function fetchUserProfile(token) {
  return api.get("profile/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}