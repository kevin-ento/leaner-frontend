"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { courseService } from "../../services/courseService";
import { showToast } from "../../components/Toast";
import { Link } from "react-router-dom";
import { routes } from "../../constants/routes";
import LoadingScreen from "../../components/LoadingScreen";
import { extractItem } from "../../utils/apiHelpers";

const CourseFormPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await courseService.getCourse(id);
      const courseData = extractItem(response, ["course"]);
      if (courseData) {
        setFormData({
          title: courseData.title || "",
          description: courseData.description || "",
          category: courseData.category || "",
        });
      }
    } catch (_error) {
      showToast("Failed to fetch course details", "error");
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
      newErrors.title = "Course title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Course description is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Course category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isEditing) {
        await courseService.updateCourse(id, formData);
        showToast("Course updated successfully!", "success");
      } else {
        await courseService.createCourse(formData);
        showToast("Course created successfully!", "success");
      }
      navigate(routes.instructor);
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "create"} course`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen fullHeight={false} />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title={isEditing ? "Edit Course" : "Create Course"} />

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
            {isEditing ? "Edit Course" : "Create New Course"}
          </h2>

          <form onSubmit={handleSubmit}>
            <Input
              label="Course Title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Enter course title"
              required
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Course Description <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`input-field ${
                  errors.description ? "border-red-500 focus:ring-red-500" : ""
                }`}
                placeholder="Enter course description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <Input
              label="Category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
              placeholder="e.g., Programming, Design, Business"
              required
            />

            <div className="flex space-x-4">
              <Button type="submit" loading={loading}>
                {isEditing ? "Update Course" : "Create Course"}
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

export default CourseFormPage;
