"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import ProtectedRoute from "../components/ProtectedRoute"

// Auth Pages
import LoginPage from "../pages/auth/LoginPage"
import RegisterPage from "../pages/auth/RegisterPage"
import VerifyOtpPage from "../pages/auth/VerifyOtpPage"
import ForgetPasswordPage from "../pages/auth/ForgetPasswordPage"
import ResetPasswordOtpPage from "../pages/auth/ResetPasswordOtpPage"
import ResetPasswordPage from "../pages/auth/ResetPasswordPage"
import ChangePasswordPage from "../pages/auth/ChangePasswordPage"

// Dashboard Pages
import StudentDashboard from "../pages/dashboard/StudentDashboard"
import InstructorDashboard from "../pages/dashboard/InstructorDashboard"
import AdminDashboard from "../pages/dashboard/AdminDashboard"

// Course Pages
import MyCoursesPage from "../pages/course/MyCoursesPage"
import AllCoursesPage from "../pages/course/AllCoursesPage"
import CourseFormPage from "../pages/course/CourseFormPage"
import CourseDetailsPage from "../pages/course/CourseDetailsPage"

// Session Pages
import SessionFormPage from "../pages/session/SessionFormPage"

// Profile Page
import ProfilePage from "../pages/ProfilePage"

// Not Found
import NotFoundPage from "../pages/NotFoundPage"

const AppRoutes = () => {
  const { isAuthenticated, user, loading } = useAuth()

  const getDashboardRoute = () => {
    if (!user) return "/login"

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to={getDashboardRoute()} replace /> : <LoginPage />} />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to={getDashboardRoute()} replace /> : <RegisterPage />}
      />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/forget-password" element={<ForgetPasswordPage />} />
      <Route path="/reset-password-otp" element={<ResetPasswordOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Routes with proper role checking */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor-dashboard"
        element={
          <ProtectedRoute requiredRole="instructor">
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <MyCoursesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/all-courses"
        element={
          <ProtectedRoute>
            <AllCoursesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course/:id"
        element={
          <ProtectedRoute>
            <CourseDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-course"
        element={
          <ProtectedRoute requiredRole="instructor">
            <CourseFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-course/:id"
        element={
          <ProtectedRoute requiredRole="instructor">
            <CourseFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-session"
        element={
          <ProtectedRoute requiredRole="instructor">
            <SessionFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-session/:id"
        element={
          <ProtectedRoute requiredRole="instructor">
            <SessionFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/change-password/:userId"
        element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={isAuthenticated ? getDashboardRoute() : "/login"} replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
