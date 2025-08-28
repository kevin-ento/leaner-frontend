"use client";

import { memo } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { routes } from "../constants/routes";
import LoadingScreen from "./LoadingScreen";

const ProtectedRoute = memo(({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.login} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const dashboardRoute =
      user?.role === "instructor"
        ? routes.instructor
        : user?.role === "admin"
        ? routes.admin
        : routes.student;
    return <Navigate to={dashboardRoute} replace />;
  }

  return children;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
