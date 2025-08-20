"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ProtectedRoute from "../components/ProtectedRoute";
import { getDashboardLink } from "../utils/getDashboardRoute";
import LoadingScreen from "../components/LoadingScreen";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import ForgetPasswordPage from "../pages/auth/ForgetPasswordPage";
import ResetPasswordOtpPage from "../pages/auth/ResetPasswordOtpPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage";

// Dashboard Pages
import StudentDashboard from "../pages/dashboard/StudentDashboard/index";
import InstructorDashboard from "../pages/dashboard/InstructorDashboard/index";
import AdminDashboard from "../pages/dashboard/AdminDashboard/index";

// Course Pages
import MyCoursesPage from "../pages/course/MyCoursesPage";
import AllCoursesPage from "../pages/course/AllCoursesPage";
import CourseFormPage from "../pages/course/CourseFormPage";
import CourseDetailsPage from "../pages/course/CourseDetailsPage";

// Session Pages
import SessionFormPage from "../pages/session/SessionFormPage";

// Profile Page
import ProfilePage from "../pages/profile/index";

// Not Found
import NotFoundPage from "../pages/NotFoundPage";
import { routes } from "../constants/routes";

const AppRoutes = () => {
  const { isAuthenticated, user, loading } = useAuth();

  const dashboardRoute = getDashboardLink(user);

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path={routes.login}
        element={
          isAuthenticated ? (
            <Navigate to={dashboardRoute} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path={routes.register}
        element={
          isAuthenticated ? (
            <Navigate to={dashboardRoute} replace />
          ) : (
            <RegisterPage />
          )
        }
      />
      <Route path={routes.verifyOtp} element={<VerifyOtpPage />} />
      <Route path={routes.forgetPassword} element={<ForgetPasswordPage />} />
      <Route
        path={routes.resetPasswordOtp}
        element={<ResetPasswordOtpPage />}
      />
      <Route path={routes.resetPassword} element={<ResetPasswordPage />} />

      {/* Protected Routes with proper role checking */}
      <Route
        path={routes.student}
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.instructor}
        element={
          <ProtectedRoute requiredRole="instructor">
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.instructorWithCourse()}
        element={
          <ProtectedRoute requiredRole="instructor">
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.admin}
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.myCourses}
        element={
          <ProtectedRoute>
            <MyCoursesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.allCourses}
        element={
          <ProtectedRoute>
            <AllCoursesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.courseDetails()}
        element={
          <ProtectedRoute>
            <CourseDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.createCourse}
        element={
          <ProtectedRoute requiredRole="instructor">
            <CourseFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.editCourse()}
        element={
          <ProtectedRoute requiredRole="instructor">
            <CourseFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.addSession}
        element={
          <ProtectedRoute requiredRole="instructor">
            <SessionFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.addSessionWithCourse()}
        element={
          <ProtectedRoute requiredRole="instructor">
            <SessionFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.editSession()}
        element={
          <ProtectedRoute requiredRole="instructor">
            <SessionFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.editSessionWithCourse()}
        element={
          <ProtectedRoute requiredRole="instructor">
            <SessionFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.changePassword()}
        element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.profile}
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route
        path={routes.home}
        element={
          <Navigate
            to={isAuthenticated ? dashboardRoute : routes.login}
            replace
          />
        }
      />

      {/* 404 */}
      <Route path={routes.notFound} element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
