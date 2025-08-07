import apiClient from "./apiClient";

class AuthService {
  async register(userData) {
    try {
      const response = await apiClient.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async verifyOtp(data) {
    try {
      const response = await apiClient.post("/auth/verify-otp", data);
      return response.data;
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      const response = await apiClient.post("/auth/forget-password", { email });
      return response.data;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  }

  async resetPassword(data) {
    try {
      const response = await apiClient.post("/auth/reset-password", data);
      return response.data;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }

  async changePassword(userId, data) {
    try {
      const response = await apiClient.put(
        `/auth/change-password/${userId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  }

  async getMe() {
    try {
      let response;
      response = await apiClient.get("/user/me");
      return response.data;
    } catch (error) {
      console.error("Get me error:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
