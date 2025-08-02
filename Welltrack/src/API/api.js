import axios from "axios";

const api = axios.create({
  baseURL: "https://dr-reminder-backend-test.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    const publicEndpoints = [
      "/accounts/register/",
      "/accounts/login/",
      "/accounts/logout/",
      "/accounts/reset-password/",
      "/accounts/reset-password-confirm/",
      "/accounts/token/verify/",
    ];

    const isPublic = publicEndpoints.some((endpoint) =>
      config.url.endsWith(endpoint)
    );

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
