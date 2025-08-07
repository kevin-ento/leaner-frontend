"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "../../components/Header"
import Button from "../../components/Button"
import { courseService } from "../../services/courseService"
import { enrollmentService } from "../../services/enrollmentService"
import { sessionService } from "../../services/sessionService"
import { useAuth } from "../../hooks/useAuth"
import { showToast } from "../../components/Toast"

const MyCoursesPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()
  const navigate = useNavigate()

  const getDashboardLink = () => {
    if (!user) return "/"

    switch (user.role) {
      case "student":
        return "/dashboard"
      case "instructor":
        return "/instructor-dashboard"
      case "admin":
        return "/admin-dashboard"
      default:
        return "/dashboard"
    }
  }

  useEffect(() => {
    fetchMyCourses()
  }, [])

  const fetchMyCourses = async () => {
    try {
      setLoading(true)
      const userId = user._id || user.id

      const [coursesRes, enrollmentsRes, sessionsRes] = await Promise.all([
        courseService.getAllCourses(),
        enrollmentService.getAllEnrollments(),
        sessionService.getAllSessions(),
      ])

      // Process courses
      let courses = []
      if (coursesRes && coursesRes.data) {
        if (Array.isArray(coursesRes.data)) {
          courses = coursesRes.data
        } else if (coursesRes.data.list && Array.isArray(coursesRes.data.list)) {
          courses = coursesRes.data.list
        }
      }

      // Process enrollments
      let enrollments = []
      if (enrollmentsRes && enrollmentsRes.data) {
        if (Array.isArray(enrollmentsRes.data)) {
          enrollments = enrollmentsRes.data
        } else if (enrollmentsRes.data.list && Array.isArray(enrollmentsRes.data.list)) {
          enrollments = enrollmentsRes.data.list
        }
      }

      // Process sessions
      let sessionsData = []
      if (sessionsRes && sessionsRes.data) {
        if (Array.isArray(sessionsRes.data)) {
          sessionsData = sessionsRes.data
        } else if (sessionsRes.data.list && Array.isArray(sessionsRes.data.list)) {
          sessionsData = sessionsRes.data.list
        }
      }

      // Filter student's approved enrollments
      const studentEnrollments = enrollments.filter((enrollment) => {
        const enrollmentStudentId = enrollment.studentId?._id || enrollment.studentId?.id || enrollment.studentId
        return String(enrollmentStudentId) === String(userId) && enrollment.status === "approved"
      })

      // Get enrolled courses
      const enrolledCourseIds = studentEnrollments.map((e) => e.courseId?._id || e.courseId?.id || e.courseId)
      const myCourses = courses.filter((course) => {
        const courseId = course._id || course.id
        return enrolledCourseIds.includes(String(courseId))
      })

      setEnrolledCourses(myCourses)
      setSessions(sessionsData)
    } catch (error) {
      showToast("Failed to fetch courses", "error")
    } finally {
      setLoading(false)
    }
  }

  const getSessionCount = (courseId) => {
    return sessions.filter((session) => {
      const sessionCourseId = session.courseId?._id || session.courseId?.id || session.courseId
      return String(sessionCourseId) === String(courseId)
    }).length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="My Courses" />

      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link to={getDashboardLink()}>
            <Button variant="outline" size="sm">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Enrolled Courses</h2>
          <Link to="/all-courses">
            <Button>Browse More Courses</Button>
          </Link>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No enrolled courses yet</h3>
            <p className="text-gray-500 mb-4">Start learning by enrolling in courses that interest you.</p>
            <Link to="/all-courses">
              <Button>Browse All Courses</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => {
              const courseId = course._id || course.id
              const instructorName = course.instructorId?.name || "Unknown Instructor"
              const sessionCount = getSessionCount(courseId)

              return (
                <div key={courseId} className="card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Enrolled</span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Instructor: {instructorName}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{sessionCount} sessions</span>
                      <span>Category: {course.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link to="/dashboard">
                      <Button size="sm">Continue Learning</Button>
                    </Link>
                    <Link to={`/course/${courseId}`}>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyCoursesPage
