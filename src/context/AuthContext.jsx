"use client";

import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
          setToken(savedToken);

          // Try to get user data with the saved token
          const response = await authService.getMe();

          let userData = response?.data?.user || response?.data;
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Only remove token if it's actually invalid (401/403)
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      if (credentials.token && credentials.user) {
        localStorage.setItem("token", credentials.token);
        setToken(credentials.token);
        setUser(credentials.user);
        return { success: true };
      }

      const response = await authService.login(credentials);

      const token = response?.data?.token;
      const userData = response?.data?.user || response?.data;

      if (!token) {
        throw new Error("No authentication token received");
      }

      localStorage.setItem("token", token);
      setToken(token);
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Login failed. Please check your credentials.",
      };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const response = await authService.register(userData);
      return { success: true, data: response };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again.",
      };
    }
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUserData,
    }));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user,
    isStudent: user?.role === "student",
    isInstructor: user?.role === "instructor",
    isAdmin: user?.role === "admin",
  }), [user, token, loading, login, register, logout, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
