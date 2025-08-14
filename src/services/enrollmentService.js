import apiClient from "./apiClient";

export const enrollmentService = {
  async getAllEnrollments() {
    return (await apiClient.get("/enrollment")).data;
  },

  async getEnrollmentStudents() {
    return (await apiClient.get("/enrollment/students")).data;
  },

  async getEnrollment(id) {
    return (await apiClient.get(`/enrollment/${id}`)).data;
  },

  async createEnrollment(enrollmentData) {
    return (await apiClient.post("/enrollment", enrollmentData)).data;
  },

  async updateEnrollment(id, enrollmentData) {
    return (
      await apiClient.patch(`/enrollment/${id}`, enrollmentData)
    ).data;
  },

  async deleteEnrollment(id) {
    return (await apiClient.delete(`/enrollment/${id}`)).data;
  },
};
