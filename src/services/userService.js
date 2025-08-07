import apiClient from "./apiClient";

class UserService {
  async updateProfile(userId, data) {
    try {
      const response = await apiClient.put(`/user/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  }

  async getProfile(userId) {
    try {
      const response = await apiClient.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  }

  async getAllUsers() {
    const response = await apiClient.get("/user");
    return response.data;
  }

  async deleteUser(userId) {
    const response = await apiClient.delete(`/user/${userId}`);
    return response.data;
  }
}

export const userService = new UserService();
