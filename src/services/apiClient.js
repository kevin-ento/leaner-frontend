import axios from "axios";
import { routes } from "../constants/routes";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  timeout: 10000,
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
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on auth pages
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
