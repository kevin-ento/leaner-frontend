"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState({});
  const [enrolledStudentsLoading, setEnrolledStudentsLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const { user } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();

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

  // Handle course management state based on URL path parameter
  useEffect(() => {
    if (myCourses.length > 0) {
      if (courseId) {
        // Course ID in URL - show course management
        const course = myCourses.find(c => getEntityId(c) === courseId);
        if (course) {
          setSelectedCourse(course);
          setActiveView("course-management");
        }
      } else {
        // No course ID in URL - show main courses view
        setSelectedCourse(null);
        setActiveView("my-courses");
      }
    }
  }, [myCourses, courseId]);

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
          setEnrolledStudentsLoading(true);
          setSessionsLoading(true);
          
          const [enrollmentsRes, sessionsRes] = await Promise.all([
            enrollmentService.getAllEnrollments(),
            sessionService.getAllSessions(),
          ]);
          
          const enrollmentsData = extractArray(enrollmentsRes);
          const sessionsData = extractArray(sessionsRes);

          const courseId = getEntityId(selectedCourse);
          const approvedEnrollments = enrollmentsData.filter(
            (e) =>
              getEntityId(e.courseId) === courseId && e.status === "approved"
          );
          setEnrolledStudents(approvedEnrollments);
          
          // Update sessions for the selected course
          const courseSessions = sessionsData.filter((session) =>
            getEntityId(session.courseId) === courseId
          );
          setSessions(prev => {
            const otherSessions = prev.filter(s => getEntityId(s.courseId) !== courseId);
            return [...otherSessions, ...courseSessions];
          });
        } catch (error) {
          console.error("Failed to fetch course data:", error);
        } finally {
          setEnrolledStudentsLoading(false);
          setSessionsLoading(false);
        }
      };
      fetchEnrolledStudents();
    }
  }, [selectedCourse]);

  const handleApproveEnrollment = async (enrollmentId) => {
    try {
      setEnrollmentLoading(prev => ({ ...prev, [enrollmentId]: true }));
      
      await enrollmentService.updateEnrollment(enrollmentId, {
        status: "approved",
      });
      
      // Update local state immediately instead of refetching
      const updatedEnrollment = enrollmentRequests.find(e => getEntityId(e) === enrollmentId);
      if (updatedEnrollment) {
        // Remove from pending requests
        setEnrollmentRequests(prev => 
          prev.filter(e => getEntityId(e) !== enrollmentId)
        );
        
        // Add to enrolled students if we're currently viewing that course
        if (selectedCourse) {
          const courseId = getEntityId(selectedCourse);
          if (getEntityId(updatedEnrollment.courseId) === courseId) {
            setEnrolledStudents(prev => [...prev, { ...updatedEnrollment, status: "approved" }]);
          }
        }
      }
      
      showToast("Enrollment approved!", "success");
    } catch (error) {
      console.error("Failed to approve enrollment:", error);
      showToast("Failed to approve enrollment", "error");
    } finally {
      setEnrollmentLoading(prev => ({ ...prev, [enrollmentId]: false }));
    }
  };

  const handleRejectEnrollment = async (enrollmentId) => {
    try {
      setEnrollmentLoading(prev => ({ ...prev, [enrollmentId]: true }));
      
      await enrollmentService.updateEnrollment(enrollmentId, {
        status: "rejected",
      });
      
      // Update local state immediately
      setEnrollmentRequests(prev => 
        prev.filter(e => getEntityId(e) !== enrollmentId)
      );
      
      showToast("Enrollment rejected", "success");
    } catch (error) {
      console.error("Failed to reject enrollment:", error);
      showToast("Failed to reject enrollment", "error");
    } finally {
      setEnrollmentLoading(prev => ({ ...prev, [enrollmentId]: false }));
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    try {
      setDeleteLoading(true);
      const courseId = getEntityId(courseToDelete);
      await courseService.deleteCourse(courseId);
      
      // Update local state immediately
      setMyCourses(prev => prev.filter(c => getEntityId(c) !== courseId));
      setSessions(prev => prev.filter(s => getEntityId(s.courseId) !== courseId));
      setEnrollmentRequests(prev => prev.filter(e => getEntityId(e.courseId) !== courseId));
      
      // If we were managing the deleted course, go back to courses view
      if (selectedCourse && getEntityId(selectedCourse) === courseId) {
        setSelectedCourse(null);
        setActiveView("my-courses");
      }
      
      showToast("Course deleted successfully!", "success");
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error("Failed to delete course:", error);
      showToast("Failed to delete course", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await sessionService.deleteSession(sessionId);
      
      // Update local state immediately
      setSessions(prev => prev.filter(s => getEntityId(s) !== sessionId));
      
      showToast("Session deleted successfully!", "success");
    } catch (error) {
      console.error("Failed to delete session:", error);
      showToast("Failed to delete session", "error");
    }
  };

  const handleManageCourse = (course) => {
    setSelectedCourse(course);
    setActiveView("course-management");
    setSidebarOpen(false);
    
    // Update URL to use path parameter instead of query parameter
    navigate(routes.instructorWithCourse(getEntityId(course)));
  };

  const handleDeleteCourseClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setActiveView("my-courses");
    
    // Navigate back to main instructor dashboard
    navigate(routes.instructor);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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

  // Skeleton loading component
  const DashboardSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Instructor Dashboard" />

      {/* Mobile Header with Menu Toggle */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Courses</h2>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 min-h-screen">
          <Sidebar items={sidebarItems} />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
            </div>
          </div>

          {/* Courses Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );

  if (loading) return <DashboardSkeleton />;

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
              onBack={handleBackToCourses}
              onApproveEnrollment={handleApproveEnrollment}
              onRejectEnrollment={handleRejectEnrollment}
              onDeleteSession={handleDeleteSession}
              enrollmentLoading={enrollmentLoading}
              enrolledStudentsLoading={enrolledStudentsLoading}
              sessionsLoading={sessionsLoading}
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
        loading={deleteLoading}
      />
    </div>
  );
};

export default InstructorDashboard;
