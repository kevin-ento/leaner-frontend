"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "../../../components/Header";
import { courseService } from "../../../services/courseService";
import { enrollmentService } from "../../../services/enrollmentService";
import { sessionService } from "../../../services/sessionService";
import { useAuth } from "../../../hooks/useAuth";
import { showToast } from "../../../components/Toast";
import LoadingScreen from "../../../components/LoadingScreen";
import CoursesSidebar from "./CoursesSidebar";
import SessionsSidebar from "./SessionsSidebar";
import MainContent from "./MainContent";
import QuickActionsBar from "./QuickActionsBar";
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
      const enrolledCourseIds = approvedEnrollments.map((e) =>
        getEntityId(e.courseId)
      );
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
      
      // Update local state immediately instead of refetching
      const course = allCourses.find(c => getEntityId(c) === String(courseId));
      if (course) {
        const newEnrollment = {
          _id: `temp-${Date.now()}`, // Temporary ID
          courseId: courseId,
          studentId: user,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        setEnrollments(prev => [...prev, newEnrollment]);
      }
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
    sessions.filter(
      (session) => getEntityId(session.courseId) === String(courseId)
    );

  const handleCourseSelect = useCallback((course) => {
    setSelectedCourse(course);
    setSelectedSession(null);
    // Auto-select first session if available
    const courseId = getEntityId(course);
    const courseSessions = getCourseSessions(courseId);
    if (courseSessions.length > 0) {
      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        setSelectedSession(courseSessions[0]);
      }, 200);
    }
    setSidebarOpen(false); // Close mobile sidebar
  }, [getCourseSessions]);

  const handleSessionSelect = useCallback((session) => {
    // Prevent unnecessary re-renders if selecting the same session
    if (selectedSession && (selectedSession._id || selectedSession.id) === (session._id || session.id)) {
      return;
    }
    setSelectedSession(session);
  }, [selectedSession]);

  const handleBackToCourse = useCallback(() => {
    setSelectedSession(null);
  }, []);

  // Skeleton loading component
  const DashboardSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
              className="fixed inset-0 bg-gray-600 dark:bg-gray-800 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 backdrop-blur-md border-r border-gray-200 dark:border-gray-700">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-gray-800 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                >
                  <svg
                    className="h-6 w-6 text-gray-600 dark:text-gray-400"
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
              <div className="animate-pulse p-4 space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Left Sidebar - Courses */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col">
          <div className="animate-pulse p-4 space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center p-4 animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </main>

        {/* Desktop Right Sidebar - Sessions */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col">
          <div className="animate-pulse p-4 space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
              className="fixed inset-0 bg-gray-600 dark:bg-gray-800 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 shadow-2xl">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-gray-800 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200"
                >
                  <svg
                    className="h-6 w-6 text-gray-600 dark:text-gray-400"
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
            setSelectedSession={handleSessionSelect}
            onBackToCourse={handleBackToCourse}
          />
        </main>

        {/* Desktop Right Sidebar - Sessions */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col">
          <SessionsSidebar
            selectedCourse={selectedCourse}
            selectedSession={selectedSession}
            getCourseSessions={getCourseSessions}
            setSelectedSession={handleSessionSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
