import apiClient from "./apiClient";

export const sessionService = {
  async getAllSessions() {
    return (await apiClient.get("/session")).data;
  },

  async getSession(id) {
    return (await apiClient.get(`/session/${id}`)).data;
  },

  async createSession(sessionData) {
    return (await apiClient.post("/session", sessionData)).data;
  },

  async updateSession(id, sessionData) {
    return (await apiClient.put(`/session/${id}`, sessionData)).data;
  },

  async deleteSession(id) {
    return (await apiClient.delete(`/session/${id}`)).data;
  },
};
