import { routes } from "../constants/routes";
import apiClient from "./apiClient";

class AuthService {
  async register(userData) {
    return (
      await apiClient.post(`/auth${routes.register}`, userData)
    ).data;
  }

  async login(credentials) {
    return (
      await apiClient.post(`/auth${routes.login}`, credentials)
    ).data;
  }

  async verifyOtp(data) {
    return (await apiClient.post(`/auth${routes.verifyOtp}`, data)).data;
  }

  async forgotPassword(data) {
    return (
      await apiClient.post(`/auth${routes.forgetPassword}`, data)
    ).data;
  }

  async resetPassword(data) {
    return (await apiClient.post(`/auth${routes.resetPassword}`, data)).data;
  }

  async changePassword(userId, data) {
    return (
      await apiClient.put(`/auth${routes.changePassword(userId)}`, data)
    ).data;
  }

  async getMe() {
    return (await apiClient.get("/user/me")).data;
  }
}

export const authService = new AuthService();
