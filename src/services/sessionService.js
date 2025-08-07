import apiClient from "./apiClient";

export const sessionService = {
  async getAllSessions() {
    try {
      const response = await apiClient.get("/session");
      return response.data;
    } catch (error) {
      console.error("Session service error:", error);
      throw error;
    }
  },

  async getSession(id) {
    try {
      const response = await apiClient.get(`/session/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get session error:", error);
      throw error;
    }
  },

  async createSession(sessionData) {
    try {
      const response = await apiClient.post("/session", sessionData);
      return response.data;
    } catch (error) {
      console.error("Create session error:", error);
      throw error;
    }
  },

  async updateSession(id, sessionData) {
    try {
      const response = await apiClient.put(`/session/${id}`, sessionData);
      return response.data;
    } catch (error) {
      console.error("Update session error:", error);
      throw error;
    }
  },

  async deleteSession(id) {
    try {
      const response = await apiClient.delete(`/session/${id}`);
      return response.data;
    } catch (error) {
      console.error("Delete session error:", error);
      throw error;
    }
  },
};
