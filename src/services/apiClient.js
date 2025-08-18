import axios from "axios";
import { routes } from "../constants/routes";

// Resolve baseURL: prefer env vars; fallback to Render URL
const resolvedBaseUrl = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: resolvedBaseUrl,
  // Increase timeout to better handle cold starts on free-tier hosting providers
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const authPages = [
        routes.login,
        routes.register,
        routes.verifyOtp,
        routes.forgetPassword,
        routes.resetPassword,
        routes.resetPasswordOtp,
      ];

      if (!authPages.includes(currentPath)) {
        localStorage.removeItem("token");
        window.location.href = routes.login;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
