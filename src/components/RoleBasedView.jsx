"use client"

import { useAuth } from "../hooks/useAuth"

const RoleBasedView = ({ allowedRoles, children, fallback = null }) => {
  const { user } = useAuth()

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback
  }

  return children
}

export default RoleBasedView
