"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import Button from "../../../components/Button";
import { courseService } from "../../../services/courseService";
import { enrollmentService } from "../../../services/enrollmentService";
import { sessionService } from "../../../services/sessionService";
import { useAuth } from "../../../hooks/useAuth";
import { showToast } from "../../../components/Toast";
import { routes } from "../../../constants/routes";
import CourseCard from "./CourseCard";
import CourseManagement from "./CourseManagement";
import DeleteCourseModal from "./DeleteCourseModal";
import LoadingScreen from "../../../components/LoadingScreen";
import { extractArray, getEntityId } from "../../../utils/apiHelpers";

const InstructorDashboard = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("my-courses");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const sidebarItems = [
    {
      label: "My Courses",
      path: "#",
      icon: "📚",
      onClick: () => {
        setActiveView("my-courses");
        setSelectedCourse(null);
        setSidebarOpen(false);
      },
    },
    { label: "Add Course", path: routes.createCourse, icon: "➕" },
    { label: "Profile", path: routes.profile, icon: "👤" },
  ];

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
      const instructorCourses = courses.filter(
        (course) => getEntityId(course.instructorId) === userId
      );
      setMyCourses(instructorCourses);

      const sessionsData = extractArray(sessionsRes);

      // Filter sessions for instructor's courses
      const instructorSessions = sessionsData.filter((session) =>
        instructorCourses.some(
          (course) => getEntityId(session.courseId) === getEntityId(course)
        )
      );
      setSessions(instructorSessions);

      const enrollments = extractArray(enrollmentsRes);

      // Filter enrollment requests for instructor's courses
      const requests = enrollments.filter(
        (enrollment) =>
          instructorCourses.some(
            (course) => getEntityId(course) === getEntityId(enrollment.courseId)
          ) && enrollment.status === "pending"
      );
      setEnrollmentRequests(requests);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showToast("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      const fetchEnrolledStudents = async () => {
        try {
          const response = await enrollmentService.getAllEnrollments();
          const enrollmentsData = extractArray(response);

          const courseId = getEntityId(selectedCourse);
          const approvedEnrollments = enrollmentsData.filter(
            (e) => getEntityId(e.courseId) === courseId && e.status === "approved"
          );
          setEnrolledStudents(approvedEnrollments);
        } catch (error) {
          console.error("Failed to fetch enrolled students:", error);
        }
      };
      fetchEnrolledStudents();
    }
  }, [selectedCourse]);

  const handleApproveEnrollment = async (enrollmentId) => {
    try {
      await enrollmentService.updateEnrollment(enrollmentId, {
        status: "approved",
      });
      showToast("Enrollment approved!", "success");
      fetchData();
    } catch (error) {
      console.error("Failed to approve enrollment:", error);
      showToast("Failed to approve enrollment", "error");
    }
  };

  const handleRejectEnrollment = async (enrollmentId) => {
    try {
      await enrollmentService.updateEnrollment(enrollmentId, {
        status: "rejected",
      });
      showToast("Enrollment rejected", "success");
      fetchData();
    } catch (error) {
      console.error("Failed to reject enrollment:", error);
      showToast("Failed to reject enrollment", "error");
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    try {
      const courseId = getEntityId(courseToDelete);
      await courseService.deleteCourse(courseId);
      showToast("Course deleted successfully!", "success");
      setShowDeleteModal(false);
      setCourseToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete course:", error);
      showToast("Failed to delete course", "error");
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await sessionService.deleteSession(sessionId);
      showToast("Session deleted successfully!", "success");
      fetchData();
    } catch (error) {
      console.error("Failed to delete session:", error);
      showToast("Failed to delete session", "error");
    }
  };

  const handleManageCourse = (course) => {
    setSelectedCourse(course);
    setActiveView("course-management");
    setSidebarOpen(false);
  };

  const handleDeleteCourseClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const renderMyCourses = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          My Courses
        </h2>
        <Link to={routes.createCourse}>
          <Button className="w-full sm:w-auto text-sm sm:text-base">
            Add New Course
          </Button>
        </Link>
      </div>
      {myCourses.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl sm:text-3xl">📚</span>
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2">
            No courses yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm sm:text-base">
            You haven't created any courses yet.
          </p>
          <Link to={routes.createCourse}>
            <Button>Create Your First Course</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {myCourses.map((course) => (
            <CourseCard
              key={course._id || course.id}
              course={course}
              sessions={sessions}
              enrollmentRequests={enrollmentRequests}
              onManage={handleManageCourse}
              onDelete={handleDeleteCourseClick}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Instructor Dashboard" />

      {/* Mobile Header with Menu Toggle */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedCourse
              ? `Managing: ${selectedCourse.title}`
              : "My Courses"}
          </h2>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex">
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
              <Sidebar
                items={sidebarItems.map((item) => ({
                  ...item,
                  path: item.onClick ? "#" : item.path,
                }))}
                className="h-full"
              />
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 min-h-screen">
          <Sidebar
            items={sidebarItems.map((item) => ({
              ...item,
              path: item.onClick ? "#" : item.path,
            }))}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          {activeView === "course-management" && selectedCourse ? (
            <CourseManagement
              selectedCourse={selectedCourse}
              sessions={sessions}
              enrollmentRequests={enrollmentRequests}
              enrolledStudents={enrolledStudents}
              onBack={() => {
                setSelectedCourse(null);
                setActiveView("my-courses");
              }}
              onApproveEnrollment={handleApproveEnrollment}
              onRejectEnrollment={handleRejectEnrollment}
              onDeleteSession={handleDeleteSession}
            />
          ) : (
            renderMyCourses()
          )}
        </main>
      </div>

      <DeleteCourseModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        courseToDelete={courseToDelete}
        onConfirm={handleDeleteCourse}
      />
    </div>
  );
};

export default InstructorDashboard;
