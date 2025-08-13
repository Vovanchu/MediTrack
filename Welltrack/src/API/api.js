import axios from "axios";

const api = axios.create({
  baseURL: "https://dr-reminder-backend-test.onrender.com/api",
  timeout: 10000,
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem("accessToken");
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

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
      config.url.includes(endpoint)
    );

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
