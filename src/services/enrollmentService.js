import apiClient from "./apiClient";

export const enrollmentService = {
  async getAllEnrollments() {
    try {
      const response = await apiClient.get("/enrollment");
      return response.data;
    } catch (error) {
      console.error("Enrollment service error:", error);
      throw error;
    }
  },

  async getEnrollmentStudents() {
    try {
      const response = await apiClient.get("/enrollment/students");
      return response.data;
    } catch (error) {
      console.error("Get enrollment students error:", error);
      throw error;
    }
  },

  async getEnrollment(id) {
    try {
      const response = await apiClient.get(`/enrollment/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get enrollment error:", error);
      throw error;
    }
  },

  async createEnrollment(enrollmentData) {
    try {
      const response = await apiClient.post("/enrollment", enrollmentData);
      return response.data;
    } catch (error) {
      console.error("Create enrollment error:", error);
      throw error;
    }
  },

  async updateEnrollment(id, enrollmentData) {
    try {
      const response = await apiClient.patch(
        `/enrollment/${id}`,
        enrollmentData
      );
      return response.data;
    } catch (error) {
      console.error("Update enrollment error:", error);
      throw error;
    }
  },

  async deleteEnrollment(id) {
    try {
      const response = await apiClient.delete(`/enrollment/${id}`);
      return response.data;
    } catch (error) {
      console.error("Delete enrollment error:", error);
      throw error;
    }
  },
};
