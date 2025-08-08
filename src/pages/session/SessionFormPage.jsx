"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { sessionService } from "../../services/sessionService";
import { courseService } from "../../services/courseService";
import { useAuth } from "../../hooks/useAuth";
import { showToast } from "../../components/Toast";
import { routes } from "../../constants/routes";

const SessionFormPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    date: "",
    courseId: "",
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const courseIdFromQuery = searchParams.get("courseId");
  const isEditing = !!id;
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
    if (isEditing) {
      fetchSession();
    } else if (courseIdFromQuery) {
      setFormData((prev) => ({ ...prev, courseId: courseIdFromQuery }));
    }
  }, [id, courseIdFromQuery]);

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAllCourses();

      // Handle the backend response structure: { data: { list: [...] } }
      let coursesData = [];
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          coursesData = response.data;
        } else if (response.data.list && Array.isArray(response.data.list)) {
          coursesData = response.data.list;
        } else {
          console.warn("Unexpected courses data structure:", response.data);
          coursesData = [];
        }
      }

      // Filter courses for the current instructor
      const userId = user._id || user.id;
      const instructorCourses = coursesData.filter((course) => {
        const courseInstructorId =
          course.instructorId?._id ||
          course.instructorId?.id ||
          course.instructorId;
        return String(courseInstructorId) === String(userId);
      });

      setCourses(instructorCourses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      showToast("Failed to fetch courses", "error");
      setCourses([]); // Set empty array as fallback
    }
  };

  const fetchSession = async () => {
    try {
      const response = await sessionService.getSession(id);

      // Handle the backend response structure
      let sessionData;
      if (response && response.data) {
        if (response.data.session) {
          sessionData = response.data.session;
        } else {
          sessionData = response.data;
        }
      } else {
        sessionData = response;
      }

      if (sessionData) {
        setFormData({
          title: sessionData.title || "",
          description: sessionData.description || "",
          videoUrl: sessionData.videoUrl || "",
          date: sessionData.date
            ? new Date(sessionData.date).toISOString().slice(0, 16)
            : "",
          courseId:
            sessionData.courseId?._id ||
            sessionData.courseId?.id ||
            sessionData.courseId ||
            "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch session details:", error);
      showToast("Failed to fetch session details", "error");
      navigate(routes.instructor);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Session title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Session description is required";
    }

    if (!formData.date) {
      newErrors.date = "Session date is required";
    }

    if (!formData.courseId) {
      newErrors.courseId = "Please select a course";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const sessionData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };

      if (isEditing) {
        delete sessionData.courseId;
        await sessionService.updateSession(id, sessionData);
        showToast("Session updated successfully!", "success");
      } else {
        await sessionService.createSession(sessionData);
        showToast("Session created successfully!", "success");
      }
      navigate(routes.instructor);
    } catch (error) {
      console.error("Session operation failed:", error);
      showToast(
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "create"} session`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title={isEditing ? "Edit Session" : "Add Session"} />

      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link to={routes.instructor}>
            <Button variant="outline" size="sm">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {isEditing ? "Edit Session" : "Add New Session"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Course <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className={`input-field ${
                  errors.courseId ? "border-red-500 focus:ring-red-500" : ""
                }`}
                disabled={!!courseIdFromQuery}
              >
                <option value="">Select a course</option>
                {courses.map((course) => {
                  const courseId = course._id || course.id;
                  return (
                    <option key={courseId} value={courseId}>
                      {course.title}
                    </option>
                  );
                })}
              </select>
              {errors.courseId && (
                <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>
              )}
              {courses.length === 0 && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  No courses available. Please create a course first.
                </p>
              )}
            </div>

            <Input
              label="Session Title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Enter session title"
              required
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Session Description <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`input-field ${
                  errors.description ? "border-red-500 focus:ring-red-500" : ""
                }`}
                placeholder="Enter session description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <Input
              label="Video URL (Optional)"
              name="videoUrl"
              type="url"
              value={formData.videoUrl}
              onChange={handleChange}
              error={errors.videoUrl}
              placeholder="https://example.com/video"
            />

            <Input
              label="Session Date & Time"
              name="date"
              type="datetime-local"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
              required
            />

            <div className="flex space-x-4">
              <Button
                type="submit"
                loading={loading}
                disabled={courses.length === 0}
              >
                {isEditing ? "Update Session" : "Add Session"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(routes.instructor)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SessionFormPage;
