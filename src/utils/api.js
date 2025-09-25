// client/src/utils/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4500";

// create axios instance pointed at /api
const API = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 15000,
});

// ✅ request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ response interceptor
API.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("user");
      window.dispatchEvent(new CustomEvent("unauthorized", { detail: {} }));
    }
    return Promise.reject(error);
  }
);

export default API;
