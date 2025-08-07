"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../../components/Header"
import Button from "../../components/Button"
import { courseService } from "../../services/courseService"
import { enrollmentService } from "../../services/enrollmentService"
import { sessionService } from "../../services/sessionService"
import { useAuth } from "../../hooks/useAuth"
import { showToast } from "../../components/Toast"

const StudentDashboard = () => {
  const [allCourses, setAllCourses] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [sessions, setSessions] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { user } = useAuth()

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

      // Process enrollments
      let enrollmentsData = []
      if (Array.isArray(enrollmentsRes)) {
        enrollmentsData = enrollmentsRes
      } else if (enrollmentsRes && enrollmentsRes.data) {
        if (Array.isArray(enrollmentsRes.data)) {
          enrollmentsData = enrollmentsRes.data
        } else if (enrollmentsRes.data.list && Array.isArray(enrollmentsRes.data.list)) {
          enrollmentsData = enrollmentsRes.data.list
        }
      }

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

      // Filter student's enrollments
      const studentEnrollments = enrollmentsData.filter((enrollment) => {
        const enrollmentStudentId = enrollment.studentId?._id || enrollment.studentId?.id || enrollment.studentId
        return String(enrollmentStudentId) === String(userId)
      })

      // Get enrolled courses (approved enrollments only)
      const approvedEnrollments = studentEnrollments.filter((e) => e.status === "approved")
      const enrolledCourseIds = approvedEnrollments.map((e) => e.courseId?._id || e.courseId?.id || e.courseId)

      const studentCourses = courses.filter((course) => {
        const courseId = course._id || course.id
        return enrolledCourseIds.includes(String(courseId))
      })

      setAllCourses(courses)
      setEnrolledCourses(studentCourses)
      setEnrollments(studentEnrollments)
      setSessions(sessionsData)

      // Auto-select first enrolled course and its first session
      if (studentCourses.length > 0 && !selectedCourse) {
        const firstCourse = studentCourses[0]
        setSelectedCourse(firstCourse)

        // Auto-select first session of the first course
        const courseId = firstCourse._id || firstCourse.id
        const courseSessions = sessionsData.filter((session) => {
          const sessionCourseId = session.courseId?._id || session.courseId?.id || session.courseId
          return String(sessionCourseId) === String(courseId)
        })

        if (courseSessions.length > 0) {
          setSelectedSession(courseSessions[0])
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
      showToast("Failed to fetch data", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling((prev) => ({ ...prev, [courseId]: true }))
      await enrollmentService.createEnrollment({ courseId })
      showToast("Enrollment request sent! Wait for instructor approval.", "success")
      fetchData()
    } catch (error) {
      console.error("Enrollment failed:", error)
      showToast("Enrollment failed", "error")
    } finally {
      setEnrolling((prev) => ({ ...prev, [courseId]: false }))
    }
  }

  const getEnrollmentStatus = (courseId) => {
    const enrollment = enrollments.find((e) => {
      const enrollmentCourseId = e.courseId?._id || e.courseId?.id || e.courseId
      return String(enrollmentCourseId) === String(courseId)
    })
    return enrollment ? enrollment.status : null
  }

  const getCourseSessions = (courseId) => {
    return sessions.filter((session) => {
      const sessionCourseId = session.courseId?._id || session.courseId?.id || session.courseId
      return String(sessionCourseId) === String(courseId)
    })
  }

  const extractYouTubeVideoId = (url) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const renderVideoPlayer = (session) => {
    if (!session || !session.videoUrl) {
      return (
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">No video available for this session</p>
        </div>
      )
    }

    const videoId = extractYouTubeVideoId(session.videoUrl)
    if (!videoId) {
      return (
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm sm:text-base">Invalid YouTube URL</p>
            <a
              href={session.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm sm:text-base"
            >
              Open Video Link
            </a>
          </div>
        </div>
      )
    }

    return (
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={session.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        ></iframe>
      </div>
    )
  }

  const renderCourseDetails = (course) => {
    const courseId = course._id || course.id
    const courseSessions = getCourseSessions(courseId)
    const instructorName = course.instructorId?.name || "Unknown Instructor"

    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">{course.title}</h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <span>👨‍🏫 Instructor: {instructorName}</span>
            <span>📚 Category: {course.category}</span>
            <span>🎥 {courseSessions.length} Sessions</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">Course Description</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">{course.description}</p>
        </div>

        {courseSessions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">Course Sessions</h2>
            <div className="space-y-3">
              {courseSessions.map((session, index) => (
                <div
                  key={session._id || session.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex-1 mb-3 sm:mb-0">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{session.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{session.description}</p>
                    {session.date && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(session.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Session {index + 1}</span>
                    {session.videoUrl && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs rounded-full">
                        📹 Video
                      </span>
                    )}
                    <Button size="sm" className="text-xs sm:text-sm">
                      Watch
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderMainContent = () => {
    if (!selectedCourse) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a Course</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm sm:text-base">
              Choose a course from the sidebar to view its content
            </p>
            {enrolledCourses.length === 0 && (
              <Link to="/all-courses">
                <Button>Browse All Courses</Button>
              </Link>
            )}
          </div>
        </div>
      )
    }

    // If no session is selected, show course details
    if (!selectedSession) {
      return renderCourseDetails(selectedCourse)
    }

    // Show selected session with video
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Session Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedSession.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm sm:text-base">{selectedSession.description}</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Course: {selectedCourse.title}</span>
              {selectedSession.date && <span>Date: {new Date(selectedSession.date).toLocaleDateString()}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedSession(null)} className="text-xs sm:text-sm">
              ← Back to Course
            </Button>
          </div>
        </div>

        {renderVideoPlayer(selectedSession)}

        {selectedSession.videoUrl && (
          <div className="flex items-center justify-between">
            <a
              href={selectedSession.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              Open in YouTube
            </a>
          </div>
        )}
      </div>
    )
  }

  const renderCourseSidebar = () => (
    <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Courses</h3>
      </div>

      <div className="p-4">
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">No enrolled courses yet</p>
            <Link to="/all-courses">
              <Button size="sm" className="text-xs">
                Browse Courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {enrolledCourses.map((course) => {
              const courseId = course._id || course.id
              const courseSessions = getCourseSessions(courseId)
              const isSelected = selectedCourse && (selectedCourse._id || selectedCourse.id) === courseId

              return (
                <div
                  key={courseId}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    setSelectedCourse(course)
                    setSelectedSession(null)
                    // Auto-select first session if available
                    if (courseSessions.length > 0) {
                      setSelectedSession(courseSessions[0])
                    }
                    setSidebarOpen(false) // Close mobile sidebar
                  }}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">{course.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{courseSessions.length} sessions</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Category: {course.category}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Browse All Courses Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Available Courses</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {allCourses
            .filter((course) => {
              const courseId = course._id || course.id
              const enrollmentStatus = getEnrollmentStatus(courseId)
              return !enrollmentStatus || enrollmentStatus === "rejected"
            })
            .slice(0, 5)
            .map((course) => {
              const courseId = course._id || course.id
              const instructorName = course.instructorId?.name || "Unknown Instructor"

              return (
                <div key={courseId} className="p-2 border border-gray-200 dark:border-gray-600 rounded text-xs">
                  <h5 className="font-medium text-gray-900 dark:text-white">{course.title}</h5>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">by {instructorName}</p>
                  <Button
                    size="sm"
                    className="mt-2 text-xs py-1 px-2"
                    onClick={() => handleEnroll(courseId)}
                    loading={enrolling[courseId]}
                  >
                    Enroll
                  </Button>
                </div>
              )
            })}
        </div>
        <Link to="/all-courses" className="block mt-3">
          <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
            View All Courses
          </Button>
        </Link>
      </div>
    </div>
  )

  const renderSessionsSidebar = () => {
    if (!selectedCourse) {
      return (
        <div className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sessions</h3>
          </div>
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">Select a course to view sessions</p>
          </div>
        </div>
      )
    }

    const courseId = selectedCourse._id || selectedCourse.id
    const courseSessions = getCourseSessions(courseId)

    return (
      <div className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sessions</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{selectedCourse.title}</p>
        </div>

        <div className="p-4">
          {courseSessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No sessions available</p>
            </div>
          ) : (
            <div className="space-y-2">
              {courseSessions.map((session, index) => {
                const sessionId = session._id || session.id
                const isSelected = selectedSession && (selectedSession._id || selectedSession.id) === sessionId

                return (
                  <div
                    key={sessionId}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">{session.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {session.description}
                        </p>
                        {session.date && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {new Date(session.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">#{index + 1}</span>
                    </div>
                    {session.videoUrl && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          📹 Video
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
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
      <Header title="Student Dashboard" />

      {/* Quick Actions Bar - Always Visible */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Welcome back, {user?.name || "Student"}!
            </h2>
            {selectedCourse && (
              <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">
                • Currently viewing: {selectedCourse.title}
                {selectedSession && ` → ${selectedSession.title}`}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link to="/all-courses">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
                🌐 Browse Courses
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
                📚 My Courses
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
                👤 Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex h-screen relative">
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
              {renderCourseSidebar()}
            </div>
          </div>
        )}

        {/* Desktop Left Sidebar - Courses */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col">{renderCourseSidebar()}</div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{renderMainContent()}</main>

        {/* Desktop Right Sidebar - Sessions */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col">{renderSessionsSidebar()}</div>
      </div>
    </div>
  )
}

export default StudentDashboard
