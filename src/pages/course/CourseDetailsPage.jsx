"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { courseService } from "../../services/courseService";
import { enrollmentService } from "../../services/enrollmentService";
import { sessionService } from "../../services/sessionService";
import { useAuth } from "../../hooks/useAuth";
import { showToast } from "../../components/Toast";
import { getDashboardLink } from "../../utils/getDashboardRoute";
import LoadingScreen from "../../components/LoadingScreen";
import { extractArray, extractItem, getEntityId } from "../../utils/apiHelpers";
import { routes } from "../../constants/routes";

const CourseDetailsPage = () => {
  const [course, setCourse] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const dashboardLink = getDashboardLink(user);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const userId = getEntityId(user);

      const [courseRes, sessionsRes, enrollmentsRes] = await Promise.all([
        courseService.getCourse(id),
        sessionService.getAllSessions(),
        enrollmentService.getAllEnrollments(),
      ]);

      const courseData = extractItem(courseRes, ["course"]);
      const sessionsData = extractArray(sessionsRes);
      const enrollmentsData = extractArray(enrollmentsRes);

      const courseSessions = sessionsData.filter(
        (session) => getEntityId(session.courseId) === String(id)
      );

      const enrollment = enrollmentsData.find((e) => {
        return (
          getEntityId(e.courseId) === String(id) &&
          getEntityId(e.studentId) === userId
        );
      });

      setCourse(courseData);
      setSessions(courseSessions);
      setEnrollmentStatus(enrollment ? enrollment.status : null);
    } catch (error) {
      showToast("Failed to fetch course details", "error");
      navigate(routes.allCourses);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await enrollmentService.createEnrollment({ courseId: id });
      showToast(
        "Enrollment request sent! Wait for instructor approval.",
        "success"
      );
      fetchCourseDetails();
    } catch (error) {
      showToast("Enrollment failed", "error");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <LoadingScreen />;

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Course Not Found" />
        <div className="max-w-4xl mx-auto py-8 px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Link to={routes.allCourses}>
            <Button>Browse All Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const instructorName = course.instructorId?.name || "Unknown Instructor";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Course Details" />
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to={routes.allCourses}>
            <Button variant="outline" size="sm">
              ← Back to All Courses
            </Button>
          </Link>
        </div>

        {/* Course Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {course.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>👨‍🏫 Instructor: {instructorName}</span>
                <span>📚 Category: {course.category}</span>
                <span>🎥 {sessions.length} Sessions</span>
              </div>
            </div>
            <div className="md:w-1/3 flex-shrink-0">
              {enrollmentStatus === "approved" ? (
                <div className="text-center">
                  <span className="inline-block px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full mb-3">
                    ✓ Enrolled
                  </span>
                  <div>
                    <Link to={dashboardLink}>
                      <Button className="w-full">Go to Dashboard</Button>
                    </Link>
                  </div>
                </div>
              ) : enrollmentStatus === "pending" ? (
                <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-center">
                  ⏳ Enrollment Pending
                </span>
              ) : enrollmentStatus === "rejected" ? (
                <span className="inline-block px-4 py-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-center">
                  ✗ Enrollment Rejected
                </span>
              ) : (
                <Button
                  onClick={handleEnroll}
                  loading={enrolling}
                  size="lg"
                  className="w-full"
                >
                  Enroll in Course
                </Button>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Course Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {course.description}
            </p>
          </div>
        </div>

        {/* Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Course Sessions
          </h2>

          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No sessions available for this course yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session, index) => (
                <div
                  key={session._id || session.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
                          {index + 1}
                        </span>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {session.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3 ml-11">
                        {session.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 ml-11 text-sm text-gray-500 dark:text-gray-400">
                        {session.date && (
                          <span>
                            📅 {new Date(session.date).toLocaleDateString()}
                          </span>
                        )}
                        {session.videoUrl && (
                          <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs">
                            📹 Video Available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        {enrollmentStatus !== "approved" && (
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6 mt-6 text-center">
            <h3 className="text-lg font-medium text-primary-900 dark:text-primary-100 mb-2">
              Ready to start learning?
            </h3>
            <p className="text-primary-700 dark:text-primary-300 mb-4">
              Enroll in this course to access all sessions and start your
              learning journey.
            </p>
            {enrollmentStatus === "pending" ? (
              <p className="text-yellow-700 dark:text-yellow-200">
                Your enrollment request is pending instructor approval.
              </p>
            ) : enrollmentStatus === "rejected" ? (
              <p className="text-red-700 dark:text-red-200">
                Your enrollment request was rejected. Please contact the
                instructor.
              </p>
            ) : (
              <Button onClick={handleEnroll} loading={enrolling}>
                Enroll Now
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsPage;
