"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import Modal from "../../components/Modal"
import Button from "../../components/Button"
import { courseService } from "../../services/courseService"
import { enrollmentService } from "../../services/enrollmentService"
import { sessionService } from "../../services/sessionService"
import { useAuth } from "../../hooks/useAuth"
import { showToast } from "../../components/Toast"

const InstructorDashboard = () => {
  const [myCourses, setMyCourses] = useState([])
  const [enrollmentRequests, setEnrollmentRequests] = useState([])
  const [sessions, setSessions] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState("my-courses")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)
  const [enrolledStudents, setEnrolledStudents] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { user } = useAuth()

  const sidebarItems = [
    {
      label: "My Courses",
      path: "#",
      icon: "📚",
      onClick: () => {
        setActiveView("my-courses")
        setSelectedCourse(null)
        setSidebarOpen(false)
      },
    },
    { label: "Add Course", path: "/create-course", icon: "➕" },
    { label: "Profile", path: "/profile", icon: "👤" },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const userId = user._id || user.id

      const [coursesRes, enrollmentsRes, sessionsRes] = await Promise.all([
        courseService.getAllCourses().catch((err) => {
          console.error("Failed to fetch courses:", err)
          return { data: { list: [] } }
        }),
        enrollmentService.getAllEnrollments().catch((err) => {
          console.error("Failed to fetch enrollments:", err)
          return { data: { list: [] } }
        }),
        sessionService.getAllSessions().catch((err) => {
          console.error("Failed to fetch sessions:", err)
          return { data: { list: [] } }
        }),
      ])

      // Process courses
      let courses = []
      if (Array.isArray(coursesRes)) {
        courses = coursesRes
      } else if (coursesRes && coursesRes.data) {
        if (Array.isArray(coursesRes.data)) {
          courses = coursesRes.data
        } else if (coursesRes.data.list && Array.isArray(coursesRes.data.list)) {
          courses = coursesRes.data.list
        }
      }

      // Filter instructor courses
      const instructorCourses = courses.filter((course) => {
        const courseInstructorId = course.instructorId?._id || course.instructorId?.id || course.instructorId
        return String(courseInstructorId) === String(userId)
      })

      setMyCourses(instructorCourses)

      // Process sessions
      let sessionsData = []
      if (Array.isArray(sessionsRes)) {
        sessionsData = sessionsRes
      } else if (sessionsRes && sessionsRes.data) {
        if (Array.isArray(sessionsRes.data)) {
          sessionsData = sessionsRes.data
        } else if (sessionsRes.data.list && Array.isArray(sessionsRes.data.list)) {
          sessionsData = sessionsRes.data.list
        }
      }

      // Filter sessions for instructor's courses
      const instructorSessions = sessionsData.filter((session) => {
        const sessionCourseId = session.courseId?._id || session.courseId?.id || session.courseId
        return instructorCourses.some((course) => {
          const courseId = course._id || course.id
          return String(sessionCourseId) === String(courseId)
        })
      })

      setSessions(instructorSessions)

      // Process enrollments
      let enrollments = []
      if (Array.isArray(enrollmentsRes)) {
        enrollments = enrollmentsRes
      } else if (enrollmentsRes && enrollmentsRes.data) {
        if (Array.isArray(enrollmentsRes.data)) {
          enrollments = enrollmentsRes.data
        } else if (enrollmentsRes.data.list && Array.isArray(enrollmentsRes.data.list)) {
          enrollments = enrollmentsRes.data.list
        }
      }

      // Filter enrollment requests for instructor's courses
      const requests = enrollments.filter(
        (enrollment) =>
          instructorCourses.some((course) => {
            const courseId = course._id || course.id
            const enrollmentCourseId = enrollment.courseId?._id || enrollment.courseId?.id || enrollment.courseId
            return String(courseId) === String(enrollmentCourseId)
          }) && enrollment.status === "pending",
      )
      setEnrollmentRequests(requests)
    } catch (error) {
      console.error("Failed to fetch data:", error)
      showToast("Failed to fetch data", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedCourse) {
      const fetchEnrolledStudents = async () => {
        try {
          const response = await enrollmentService.getAllEnrollments()
          let enrollmentsData = []
          if (response && response.data) {
            if (Array.isArray(response.data)) {
              enrollmentsData = response.data
            } else if (response.data.list && Array.isArray(response.data.list)) {
              enrollmentsData = response.data.list
            }
          }

          const courseId = selectedCourse._id || selectedCourse.id
          const approvedEnrollments = enrollmentsData.filter((e) => {
            const enrollmentCourseId = e.courseId?._id || e.courseId?.id || e.courseId
            return String(enrollmentCourseId) === String(courseId) && e.status === "approved"
          })

          setEnrolledStudents(approvedEnrollments)
        } catch (error) {
          console.error("Failed to fetch enrolled students:", error)
        }
      }

      fetchEnrolledStudents()
    }
  }, [selectedCourse])

  const handleApproveEnrollment = async (enrollmentId) => {
    try {
      await enrollmentService.updateEnrollment(enrollmentId, { status: "approved" })
      showToast("Enrollment approved!", "success")
      fetchData()
    } catch (error) {
      console.error("Failed to approve enrollment:", error)
      showToast("Failed to approve enrollment", "error")
    }
  }

  const handleRejectEnrollment = async (enrollmentId) => {
    try {
      await enrollmentService.updateEnrollment(enrollmentId, { status: "rejected" })
      showToast("Enrollment rejected", "success")
      fetchData()
    } catch (error) {
      console.error("Failed to reject enrollment:", error)
      showToast("Failed to reject enrollment", "error")
    }
  }

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return

    try {
      const courseId = courseToDelete._id || courseToDelete.id
      await courseService.deleteCourse(courseId)
      showToast("Course deleted successfully!", "success")
      setShowDeleteModal(false)
      setCourseToDelete(null)
      fetchData()
    } catch (error) {
      console.error("Failed to delete course:", error)
      showToast("Failed to delete course", "error")
    }
  }

  const handleDeleteSession = async (sessionId) => {
    try {
      await sessionService.deleteSession(sessionId)
      showToast("Session deleted successfully!", "success")
      fetchData()
    } catch (error) {
      console.error("Failed to delete session:", error)
      showToast("Failed to delete session", "error")
    }
  }

  const renderMyCourses = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">My Courses</h2>
        <Link to="/create-course">
          <Button className="w-full sm:w-auto text-sm sm:text-base">Add New Course</Button>
        </Link>
      </div>

      {myCourses.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl sm:text-3xl">📚</span>
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2">No courses yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm sm:text-base">
            You haven't created any courses yet.
          </p>
          <Link to="/create-course">
            <Button>Create Your First Course</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {myCourses.map((course) => {
            const courseId = course._id || course.id
            const courseSessions = sessions.filter((s) => {
              const sessionCourseId = s.courseId?._id || s.courseId?.id || s.courseId
              return String(sessionCourseId) === String(courseId)
            })
            const courseEnrollments = enrollmentRequests.filter((e) => {
              const enrollmentCourseId = e.courseId?._id || e.courseId?.id || e.courseId
              return String(enrollmentCourseId) === String(courseId)
            })

            return (
              <div
                key={courseId}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-3">{course.description}</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">Category: {course.category}</p>

                {course.instructorId && typeof course.instructorId === "object" && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                    Instructor: {course.instructorId.name}
                  </p>
                )}

                <div className="flex items-center justify-between mb-4 text-xs sm:text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{courseSessions.length} sessions</span>
                  <span className="text-gray-500 dark:text-gray-400">{courseEnrollments.length} pending</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setSelectedCourse(course)
                      setActiveView("course-management")
                      setSidebarOpen(false)
                    }}
                    className="flex-1 text-xs sm:text-sm"
                  >
                    Manage
                  </Button>
                  <div className="flex gap-2">
                    <Link to={`/edit-course/${courseId}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full text-xs sm:text-sm bg-transparent">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setCourseToDelete(course)
                        setShowDeleteModal(true)
                      }}
                      className="text-xs sm:text-sm"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  const renderCourseManagement = () => {
    if (!selectedCourse) return null

    const courseId = selectedCourse._id || selectedCourse.id
    const courseSessions = sessions.filter((s) => {
      const sessionCourseId = s.courseId?._id || s.courseId?.id || s.courseId
      return String(sessionCourseId) === String(courseId)
    })
    const courseEnrollments = enrollmentRequests.filter((e) => {
      const enrollmentCourseId = e.courseId?._id || e.courseId?.id || e.courseId
      return String(enrollmentCourseId) === String(courseId)
    })

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white line-clamp-2">
              Managing: {selectedCourse.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Course Management Dashboard</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedCourse(null)
              setActiveView("my-courses")
            }}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            ← Back to Courses
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Sessions Management */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Sessions ({courseSessions.length})
              </h3>
              <Link to={`/add-session?courseId=${courseId}`}>
                <Button size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                  Add Session
                </Button>
              </Link>
            </div>

            {courseSessions.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg sm:text-2xl">🎥</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-3 text-sm">No sessions created yet.</p>
                <Link to={`/add-session?courseId=${courseId}`}>
                  <Button size="sm" className="text-xs sm:text-sm">
                    Create First Session
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {courseSessions.map((session) => {
                  const sessionId = session._id || session.id
                  const sessionDate = session.date || session.scheduledAt

                  return (
                    <div key={sessionId} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base line-clamp-2">
                            {session.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {session.description}
                          </p>
                          {session.videoUrl && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              <a href={session.videoUrl} target="_blank" rel="noopener noreferrer">
                                📹 Video Link
                              </a>
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {sessionDate ? new Date(sessionDate).toLocaleDateString() : "No date"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/edit-session/${sessionId}`} className="flex-1">
                            <Button size="sm" variant="outline" className="w-full text-xs bg-transparent">
                              Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteSession(sessionId)}
                            className="text-xs"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Enrolled Students */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Enrolled Students ({enrolledStudents.length})
            </h3>

            {enrolledStudents.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg sm:text-2xl">👥</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">No enrolled students yet.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {enrolledStudents.map((enrollment) => {
                  const enrollmentId = enrollment._id || enrollment.id
                  const studentName = enrollment.studentId?.name || "Unknown Student"
                  const studentEmail = enrollment.studentId?.email || "No email"

                  return (
                    <div
                      key={enrollmentId}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{studentName}</p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{studentEmail}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full whitespace-nowrap">
                          Active
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Enrollment Requests */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Enrollment Requests ({courseEnrollments.length})
            </h3>

            {courseEnrollments.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg sm:text-2xl">📝</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">No pending enrollment requests.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {courseEnrollments.map((enrollment) => {
                  const enrollmentId = enrollment._id || enrollment.id
                  const studentName = enrollment.studentId?.name || "Unknown Student"
                  const studentEmail = enrollment.studentId?.email || "No email"

                  return (
                    <div
                      key={enrollmentId}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{studentName}</p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{studentEmail}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Requested: {new Date(enrollment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveEnrollment(enrollmentId)}
                            className="flex-1 text-xs"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleRejectEnrollment(enrollmentId)}
                            className="flex-1 text-xs"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

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
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedCourse ? `Managing: ${selectedCourse.title}` : "My Courses"}
          </h2>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
          {activeView === "course-management" && selectedCourse ? renderCourseManagement() : renderMyCourses()}
        </main>
      </div>

      {/* Delete Course Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Course">
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button variant="danger" onClick={handleDeleteCourse} className="flex-1">
            Delete Course
          </Button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="flex-1">
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default InstructorDashboard
