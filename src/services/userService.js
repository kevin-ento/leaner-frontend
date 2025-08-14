import apiClient from "./apiClient";

class UserService {
  async updateProfile(userId, data) {
    return (await apiClient.put(`/user/${userId}`, data)).data;
  }

  async getProfile(userId) {
    return (await apiClient.get(`/user/${userId}`)).data;
  }

  async getAllUsers() {
    return (await apiClient.get("/user")).data;
  }

  async deleteUser(userId) {
    return (await apiClient.delete(`/user/${userId}`)).data;
  }
}

export const userService = new UserService();
