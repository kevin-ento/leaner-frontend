"use client";

import { useState, useEffect } from "react";
import Header from "../../../components/Header";
import { courseService } from "../../../services/courseService";
import { enrollmentService } from "../../../services/enrollmentService";
import { sessionService } from "../../../services/sessionService";
import { useAuth } from "../../../hooks/useAuth";
import { showToast } from "../../../components/Toast";
import { routes } from "../../../constants/routes";
import CoursesSidebar from "./CoursesSidebar";
import SessionsSidebar from "./SessionsSidebar";
import MainContent from "./MainContent";
import QuickActionsBar from "./QuickActionsBar";
import LoadingScreen from "../../../components/LoadingScreen";
import { extractArray, getEntityId } from "../../../utils/apiHelpers";

const StudentDashboard = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

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

      const courses = extractArray(coursesRes);
      const enrollmentsData = extractArray(enrollmentsRes);
      const sessionsData = extractArray(sessionsRes);

      const studentEnrollments = enrollmentsData.filter(
        (enrollment) => getEntityId(enrollment.studentId) === userId
      );

      const approvedEnrollments = studentEnrollments.filter(
        (e) => e.status === "approved"
      );
      const enrolledCourseIds = approvedEnrollments.map((e) => getEntityId(e.courseId));
      const studentCourses = courses.filter((course) =>
        enrolledCourseIds.includes(getEntityId(course))
      );

      setAllCourses(courses);
      setEnrolledCourses(studentCourses);
      setEnrollments(studentEnrollments);
      setSessions(sessionsData);

      if (studentCourses.length > 0 && !selectedCourse) {
        const firstCourse = studentCourses[0];
        setSelectedCourse(firstCourse);

        const courseId = getEntityId(firstCourse);
        const courseSessions = sessionsData.filter(
          (session) => getEntityId(session.courseId) === courseId
        );
        if (courseSessions.length > 0) {
          setSelectedSession(courseSessions[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showToast("Failed to fetch data", "error");
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
      console.error("Enrollment failed:", error);
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

  const getCourseSessions = (courseId) =>
    sessions.filter((session) => getEntityId(session.courseId) === String(courseId));

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedSession(null);
    // Auto-select first session if available
    const courseId = getEntityId(course);
    const courseSessions = getCourseSessions(courseId);
    if (courseSessions.length > 0) {
      setSelectedSession(courseSessions[0]);
    }
    setSidebarOpen(false); // Close mobile sidebar
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Student Dashboard" />

      <QuickActionsBar
        user={user}
        selectedCourse={selectedCourse}
        selectedSession={selectedSession}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex" style={{ height: "calc(100vh - 120px)" }}>
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <CoursesSidebar
                enrolledCourses={enrolledCourses}
                allCourses={allCourses}
                selectedCourse={selectedCourse}
                getCourseSessions={getCourseSessions}
                getEnrollmentStatus={getEnrollmentStatus}
                enrolling={enrolling}
                onCourseSelect={handleCourseSelect}
                onEnroll={handleEnroll}
              />
            </div>
          </div>
        )}

        {/* Desktop Left Sidebar - Courses */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col">
          <CoursesSidebar
            enrolledCourses={enrolledCourses}
            allCourses={allCourses}
            selectedCourse={selectedCourse}
            getCourseSessions={getCourseSessions}
            getEnrollmentStatus={getEnrollmentStatus}
            enrolling={enrolling}
            onCourseSelect={handleCourseSelect}
            onEnroll={handleEnroll}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <MainContent
            selectedCourse={selectedCourse}
            selectedSession={selectedSession}
            enrolledCourses={enrolledCourses}
            getCourseSessions={getCourseSessions}
            setSelectedSession={setSelectedSession}
          />
        </main>

        {/* Desktop Right Sidebar - Sessions */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col">
          <SessionsSidebar
            selectedCourse={selectedCourse}
            selectedSession={selectedSession}
            getCourseSessions={getCourseSessions}
            setSelectedSession={setSelectedSession}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
