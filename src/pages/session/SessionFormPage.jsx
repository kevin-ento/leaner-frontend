"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { extractArray, extractItem, getEntityId } from "../../utils/apiHelpers";

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
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { sessionId, courseId: courseIdFromParams } = useParams();
  const [searchParams] = useSearchParams();
  const courseIdFromQuery = searchParams.get("courseId");
  // Support both old and new URL structures
  const courseIdFromUrl = courseIdFromParams || courseIdFromQuery;
  const isEditing = !!sessionId;
  const { user } = useAuth();

  // Memoize expensive computations
  const userId = useMemo(() => getEntityId(user), [user]);
  const instructorCourses = useMemo(() => {
    return courses.filter((course) => {
      const courseInstructorId = getEntityId(course.instructorId);
      return String(courseInstructorId) === String(userId);
    });
  }, [courses, userId]);

  const selectedCourse = useMemo(() => 
    instructorCourses.find(c => getEntityId(c) === formData.courseId), 
    [instructorCourses, formData.courseId]
  );

  const backButtonText = useMemo(() => 
    selectedCourse ? `← Back to ${selectedCourse.title}` : "← Back to Dashboard", 
    [selectedCourse]
  );

  const backButtonUrl = useMemo(() => 
    selectedCourse ? routes.instructorWithCourse(formData.courseId) : routes.instructor, 
    [selectedCourse, formData.courseId]
  );

  // Memoize fetch functions
  const fetchCourses = useCallback(async () => {
    try {
      const response = await courseService.getAllCourses();
      const coursesData = extractArray(response);
      setCourses(coursesData);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      showToast("Failed to fetch courses", "error");
      setCourses([]); 
    }
  }, []);

  const fetchSession = useCallback(async () => {
    try {
      const response = await sessionService.getSession(sessionId);
      const sessionData = extractItem(response, ["session"]);

      if (sessionData) {
        setFormData({
          title: sessionData.title || "",
          description: sessionData.description || "",
          videoUrl: sessionData.videoUrl || "",
          date: sessionData.date
            ? new Date(sessionData.date).toISOString().slice(0, 16)
            : "",
          courseId: getEntityId(sessionData.courseId) || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch session details:", error);
      showToast("Failed to fetch session details", "error");
      navigate(routes.instructor);
    }
  }, [sessionId, navigate]);

  useEffect(() => {
    const initializeForm = async () => {
      try {
        setInitialLoading(true);
        await fetchCourses();
        
        if (isEditing) {
          await fetchSession();
        } else if (courseIdFromUrl) {
          setFormData((prev) => ({ ...prev, courseId: courseIdFromUrl }));
        }
      } catch (error) {
        console.error("Failed to initialize form:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    initializeForm();
  }, [sessionId, courseIdFromUrl, fetchCourses, fetchSession, isEditing]);

  const handleChange = useCallback((e) => {
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
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Session title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Session description is required";
    }

    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = "Video URL is required";
    } else if (!isValidUrl(formData.videoUrl)) {
      newErrors.videoUrl = "Please enter a valid URL";
    }

    if (!formData.date) {
      newErrors.date = "Session date is required";
    }

    if (!formData.courseId) {
      newErrors.courseId = "Please select a course";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const isValidUrl = useCallback((string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const sessionData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };

      if (isEditing) {
        const courseIdForNavigation = formData.courseId; // Store courseId before deleting
        delete sessionData.courseId;
        await sessionService.updateSession(sessionId, sessionData);
        showToast("Session updated successfully!", "success");
        
        // Navigate back to course management for edit
        if (courseIdForNavigation) {
          navigate(routes.instructorWithCourse(courseIdForNavigation));
        } else {
          navigate(routes.instructor);
        }
      } else {
        await sessionService.createSession(sessionData);
        showToast("Session created successfully!", "success");
        
        // Navigate back to course management for create
        if (formData.courseId) {
          navigate(routes.instructorWithCourse(formData.courseId));
        } else {
          navigate(routes.instructor);
        }
      }
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
  }, [formData, validateForm, isEditing, sessionId, navigate]);

  const handleCancel = useCallback(() => {
    navigate(backButtonUrl);
  }, [navigate, backButtonUrl]);

  // Show loading screen while initializing form
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title={isEditing ? "Edit Session" : "Add Session"} />

        <div className="max-w-2xl mx-auto py-8 px-4">
          {/* Back Button */}
          <div className="mb-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
          </div>

          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {isEditing ? "Edit Session" : "Add New Session"}
            </h2>

            {/* Skeleton Form */}
            <div className="space-y-6 animate-pulse">
              <div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
              
              <div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-2"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
              
              <div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36 mb-2"></div>
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
              
              <div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
              
              <div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
              
              <div className="flex space-x-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title={isEditing ? "Edit Session" : "Add Session"} />

      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link to={backButtonUrl}>
            <Button variant="outline" size="sm">
              {backButtonText}
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
                disabled={isEditing || !!courseIdFromUrl}
                aria-describedby={errors.courseId ? "courseId-error" : undefined}
              >
                <option value="">Select a course</option>
                {instructorCourses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
              {errors.courseId && (
                <p id="courseId-error" className="mt-1 text-sm text-red-600">{errors.courseId}</p>
              )}
              {instructorCourses.length === 0 && (
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
                aria-describedby={errors.description ? "description-error" : undefined}
              />
              {errors.description && (
                <p id="description-error" className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <Input
              label="Video URL"
              name="videoUrl"
              type="url"
              value={formData.videoUrl}
              onChange={handleChange}
              error={errors.videoUrl}
              placeholder="https://example.com/video"
              required
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
                disabled={instructorCourses.length === 0}
              >
                {isEditing ? "Update Session" : "Add Session"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
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
