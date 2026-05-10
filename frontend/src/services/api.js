import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 15000,
});

// ✅ Request interceptor — attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor — handle expired/invalid token
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");

      // Redirect to login (only if not already there)
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;