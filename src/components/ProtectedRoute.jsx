"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const dashboardRoute =
      user?.role === "instructor" ? "/instructor-dashboard" : user?.role === "admin" ? "/admin-dashboard" : "/dashboard"
    return <Navigate to={dashboardRoute} replace />
  }

  return children
}

export default ProtectedRoute
