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
import { routes } from "../../constants/routes";
import { getDashboardLink } from "../../utils/getDashboardRoute";
import { extractArray, getEntityId } from "../../utils/apiHelpers";

const MyCoursesPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
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

      const approvedEnrollments = studentEnrollments.filter(
        (enrollment) => enrollment.status === "approved"
      );

      const enrolledCoursesData = approvedEnrollments.map((enrollment) => {
        const course = coursesData.find(
          (c) => getEntityId(c) === getEntityId(enrollment.courseId)
        );
        return course;
      }).filter(Boolean);

      setEnrolledCourses(enrolledCoursesData);
      setSessions(sessionsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showToast("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  const getSessionCount = (courseId) =>
    sessions.filter(
      (session) => getEntityId(session.courseId) === String(courseId)
    ).length;

  // Skeleton loading component
  const CourseSkeleton = () => (
    <div className="card p-6 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="My Courses" />

      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link to={dashboardLink}>
            <Button variant="outline" size="sm">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Enrolled Courses
          </h2>
          <Link to={routes.allCourses}>
            <Button>Browse More Courses</Button>
          </Link>
        </div>

        {/* Loading State with Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CourseSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No enrolled courses yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Start learning by enrolling in courses that interest you.
                </p>
                <Link to={routes.allCourses}>
                  <Button>Browse All Courses</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => {
                  const courseId = getEntityId(course);
                  const instructorName =
                    course.instructorId?.name || "Unknown Instructor";
                  const sessionCount = getSessionCount(courseId);

                  return (
                    <div
                      key={courseId}
                      className="card p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {course.title}
                        </h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
                          Enrolled
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {course.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>Instructor: {instructorName}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>{sessionCount} sessions</span>
                          <span>Category: {course.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Link to={routes.student}>
                          <Button size="sm">Continue Learning</Button>
                        </Link>
                        <Link to={routes.courseDetails(courseId)}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
