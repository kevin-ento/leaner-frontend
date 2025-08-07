import apiClient from "./apiClient";

export const courseService = {
  async getAllCourses(instructorId = null) {
    try {
      let url = "/course";
      if (instructorId) {
        url += `?instructorId=${instructorId}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error("Course service error:", error);
      throw error;
    }
  },

  async getCourse(id) {
    try {
      const response = await apiClient.get(`/course/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get course error:", error);
      throw error;
    }
  },

  async createCourse(courseData) {
    try {
      const response = await apiClient.post("/course", courseData);
      return response.data;
    } catch (error) {
      console.error("Create course error:", error);
      throw error;
    }
  },

  async updateCourse(id, courseData) {
    try {
      const response = await apiClient.put(`/course/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error("Update course error:", error);
      throw error;
    }
  },

  async deleteCourse(id) {
    try {
      const response = await apiClient.delete(`/course/${id}`);
      return response.data;
    } catch (error) {
      console.error("Delete course error:", error);
      throw error;
    }
  },
};
