"use client";

import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ProtectedRoute from "../components/ProtectedRoute";
import { getDashboardLink } from "../utils/getDashboardRoute";
import LoadingScreen from "../components/LoadingScreen";

// Lazy load components for better performance
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const VerifyOtpPage = lazy(() => import("../pages/auth/VerifyOtpPage"));
const ForgetPasswordPage = lazy(() => import("../pages/auth/ForgetPasswordPage"));
const ResetPasswordOtpPage = lazy(() => import("../pages/auth/ResetPasswordOtpPage"));
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));
const ChangePasswordPage = lazy(() => import("../pages/auth/ChangePasswordPage"));

// Dashboard Pages
const StudentDashboard = lazy(() => import("../pages/dashboard/StudentDashboard/index"));
const InstructorDashboard = lazy(() => import("../pages/dashboard/InstructorDashboard/index"));
const AdminDashboard = lazy(() => import("../pages/dashboard/AdminDashboard/index"));

// Course Pages
const MyCoursesPage = lazy(() => import("../pages/course/MyCoursesPage"));
const AllCoursesPage = lazy(() => import("../pages/course/AllCoursesPage"));
const CourseFormPage = lazy(() => import("../pages/course/CourseFormPage"));
const CourseDetailsPage = lazy(() => import("../pages/course/CourseDetailsPage"));

// Session Pages
const SessionFormPage = lazy(() => import("../pages/session/SessionFormPage"));

// Profile Page
const ProfilePage = lazy(() => import("../pages/profile/index"));

// Not Found
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

import { routes } from "../constants/routes";

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <LoadingScreen message="Loading page..." />
  </div>
);

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
            <Suspense fallback={<PageLoader />}>
              <LoginPage />
            </Suspense>
          )
        }
      />
      <Route
        path={routes.register}
        element={
          isAuthenticated ? (
            <Navigate to={dashboardRoute} replace />
          ) : (
            <Suspense fallback={<PageLoader />}>
              <RegisterPage />
            </Suspense>
          )
        }
      />
      <Route 
        path={routes.verifyOtp} 
        element={
          <Suspense fallback={<PageLoader />}>
            <VerifyOtpPage />
          </Suspense>
        } 
      />
      <Route 
        path={routes.forgetPassword} 
        element={
          <Suspense fallback={<PageLoader />}>
            <ForgetPasswordPage />
          </Suspense>
        } 
      />
      <Route
        path={routes.resetPasswordOtp}
        element={
          <Suspense fallback={<PageLoader />}>
            <ResetPasswordOtpPage />
          </Suspense>
        }
      />
      <Route 
        path={routes.resetPassword} 
        element={
          <Suspense fallback={<PageLoader />}>
            <ResetPasswordPage />
          </Suspense>
        } 
      />

      {/* Protected Routes with proper role checking */}
      <Route
        path={routes.student}
        element={
          <ProtectedRoute requiredRole="student">
            <Suspense fallback={<PageLoader />}>
              <StudentDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.instructor}
        element={
          <ProtectedRoute requiredRole="instructor">
            <Suspense fallback={<PageLoader />}>
              <InstructorDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.instructorWithCourse()}
        element={
          <ProtectedRoute requiredRole="instructor">
            <Suspense fallback={<PageLoader />}>
              <InstructorDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.admin}
        element={
          <ProtectedRoute requiredRole="admin">
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.myCourses}
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <MyCoursesPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.allCourses}
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <AllCoursesPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.courseDetails()}
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <CourseDetailsPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.createCourse}
        element={
          <ProtectedRoute requiredRole="instructor">
            <Suspense fallback={<PageLoader />}>
              <CourseFormPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.editCourse()}
        element={
          <ProtectedRoute requiredRole="instructor">
            <Suspense fallback={<PageLoader />}>
              <CourseFormPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.addSession}
        element={
          <ProtectedRoute requiredRole="instructor">
            <Suspense fallback={<PageLoader />}>
              <SessionFormPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.addSessionWithCourse()}
        element={
          <ProtectedRoute requiredRole="instructor">
            <Suspense fallback={<PageLoader />}>
              <SessionFormPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.editSessionWithCourse()}
        element={
          <ProtectedRoute requiredRole="instructor">
            <Suspense fallback={<PageLoader />}>
              <SessionFormPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.editSession()}
        element={
          <ProtectedRoute requiredRole="instructor">
            <Suspense fallback={<PageLoader />}>
              <SessionFormPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.changePassword()}
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ChangePasswordPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.profile}
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ProfilePage />
            </Suspense>
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
      <Route 
        path={routes.notFound} 
        element={
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
