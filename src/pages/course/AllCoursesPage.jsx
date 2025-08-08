"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { courseService } from "../../services/courseService";
import { enrollmentService } from "../../services/enrollmentService";
import { sessionService } from "../../services/sessionService";
import { useAuth } from "../../hooks/useAuth";
import { showToast } from "../../components/Toast";
import { getDashboardLink } from "../../utils/getDashboardRoute";
import LoadingScreen from "../../components/LoadingScreen";
import { extractArray, getEntityId } from "../../utils/apiHelpers";
import { routes } from "../../constants/routes";

const AllCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { user } = useAuth();

  const dashboardLink = getDashboardLink(user);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userId = getEntityId(user);

      const [coursesRes, enrollmentsRes, sessionsRes] = await Promise.all([
        courseService.getAllCourses(),
        enrollmentService.getAllEnrollments(),
        sessionService.getAllSessions(),
      ]);

      const coursesData = extractArray(coursesRes);
      const enrollmentsData = extractArray(enrollmentsRes);
      const sessionsData = extractArray(sessionsRes);

      const studentEnrollments = enrollmentsData.filter((enrollment) => {
        const enrollmentStudentId = getEntityId(enrollment.studentId);
        return enrollmentStudentId === userId;
      });

      setCourses(coursesData);
      setEnrollments(studentEnrollments);
      setSessions(sessionsData);
    } catch (error) {
      showToast("Failed to fetch courses", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling((prev) => ({ ...prev, [courseId]: true }));
      await enrollmentService.createEnrollment({ courseId });
      showToast(
        "Enrollment request sent! Wait for instructor approval.",
        "success"
      );
      fetchData();
    } catch (error) {
      showToast("Enrollment failed", "error");
    } finally {
      setEnrolling((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  const getEnrollmentStatus = (courseId) => {
    const enrollment = enrollments.find(
      (e) => getEntityId(e.courseId) === String(courseId)
    );
    return enrollment ? enrollment.status : null;
  };

  const getSessionCount = (courseId) =>
    sessions.filter((session) => getEntityId(session.courseId) === String(courseId))
      .length;

  const getUniqueCategories = () => {
    const categories = courses.map((course) => course.category).filter(Boolean);
    return [...new Set(categories)];
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || course.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="All Courses" />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to={getDashboardLink()}>
            <Button variant="outline" size="sm">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Heading + Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Courses</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full sm:w-64"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field w-full sm:w-auto"
            >
              <option value="all">All Categories</option>
              {getUniqueCategories().map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* No courses */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || categoryFilter !== "all"
                ? "No courses match your filters."
                : "No courses available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const courseId = getEntityId(course);
              const enrollmentStatus = getEnrollmentStatus(courseId);
              const instructorName =
                course.instructorId?.name || "Unknown Instructor";
              const sessionCount = getSessionCount(courseId);

              return (
                <div
                  key={courseId}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-between border border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {course.title}
                      </h3>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                        {course.category}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {course.description}
                    </p>

                    <div className="space-y-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center justify-between">
                        <span>Instructor: {instructorName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{sessionCount} sessions</span>
                        <span>Category: {course.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
                    <div>
                      {enrollmentStatus === "approved" ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm rounded-full">
                          ✓ Enrolled
                        </span>
                      ) : enrollmentStatus === "pending" ? (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-sm rounded-full">
                          ⏳ Pending
                        </span>
                      ) : enrollmentStatus === "rejected" ? (
                        <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-sm rounded-full">
                          ✗ Rejected
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleEnroll(courseId)}
                          loading={enrolling[courseId]}
                        >
                          Enroll Now
                        </Button>
                      )}
                    </div>
                    <Link
                      to={routes.courseDetails(courseId)}
                      className="w-full sm:w-auto"
                    >
                      <Button size="sm" variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCoursesPage;
