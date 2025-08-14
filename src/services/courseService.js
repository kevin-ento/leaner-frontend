import { routes } from "../constants/routes";
import apiClient from "./apiClient";

export const courseService = {
  async getAllCourses(instructorId = null) {
    let url = "/course";
    if (instructorId) {
      url += `?instructorId=${instructorId}`;
    }
    return (await apiClient.get(url)).data;
  },

  async getCourse(id) {
    return (await apiClient.get(routes.courseDetails(id))).data;
  },

  async createCourse(courseData) {
    return (await apiClient.post("/course", courseData)).data;
  },

  async updateCourse(id, courseData) {
    return (await apiClient.put(routes.courseDetails(id), courseData)).data;
  },

  async deleteCourse(id) {
    return (await apiClient.delete(routes.courseDetails(id))).data;
  },
};
