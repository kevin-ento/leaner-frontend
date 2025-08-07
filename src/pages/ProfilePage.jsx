"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Button from "../components/Button"
import Input from "../components/Input"
import Modal from "../components/Modal"
import { useAuth } from "../hooks/useAuth"
import { userService } from "../services/userService"
import { authService } from "../services/authService"
import { showToast } from "../components/Toast"

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const { user, updateUser } = useAuth()

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      showToast("Name cannot be empty", "error")
      return
    }

    if (formData.name.trim().length < 2) {
      showToast("Name must be at least 2 characters long", "error")
      return
    }

    try {
      setLoading(true)
      const userId = user._id || user.id
      await userService.updateProfile(userId, { name: formData.name.trim() })

      // Update user in context
      updateUser({ name: formData.name.trim() })

      setIsEditing(false)
      showToast("Profile updated successfully!", "success")
    } catch (error) {
      console.error("Failed to update profile:", error)
      const errorMessage = error.response?.data?.message || "Failed to update profile. Please try again."
      showToast(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    // Validation
    if (!passwordData.oldPassword) {
      showToast("Current password is required", "error")
      return
    }

    if (!passwordData.newPassword) {
      showToast("New password is required", "error")
      return
    }

    if (!passwordData.confirmPassword) {
      showToast("Please confirm your new password", "error")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match", "error")
      return
    }

    if (passwordData.newPassword.length < 6) {
      showToast("New password must be at least 6 characters long", "error")
      return
    }

    if (passwordData.oldPassword === passwordData.newPassword) {
      showToast("New password must be different from current password", "error")
      return
    }

    try {
      setLoading(true)
      const userId = user._id || user.id
      await authService.changePassword(userId, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setShowChangePasswordModal(false)
      showToast("Password changed successfully!", "success")
    } catch (error) {
      console.error("Failed to change password:", error)
      let errorMessage = "Failed to change password. Please try again."

      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || "Current password is incorrect"
      } else if (error.response?.status === 404) {
        errorMessage = "User not found"
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      showToast(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
    })
    setIsEditing(false)
  }

  const getDashboardLink = () => {
    switch (user?.role) {
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

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "student":
        return "Student"
      case "instructor":
        return "Instructor"
      case "admin":
        return "Administrator"
      default:
        return "User"
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "instructor":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="My Profile" />

      <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link to={getDashboardLink()}>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Mobile Profile Header */}
        <div className="block lg:hidden mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h1>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {getRoleDisplayName(user.role)}
                  </span>
                  {user.isVerified && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              {!isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)} className="flex-1 text-sm">
                    Edit Name
                  </Button>
                  <Button variant="outline" onClick={() => setShowChangePasswordModal(true)} className="flex-1 text-sm">
                    Change Password
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCancel} className="flex-1 text-sm bg-transparent">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} loading={loading} className="flex-1 text-sm">
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2">
            {/* Desktop Profile Header */}
            <div className="hidden lg:block mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h1>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                          {getRoleDisplayName(user.role)}
                        </span>
                        {user.isVerified && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {!isEditing ? (
                      <>
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                          Edit Name
                        </Button>
                        <Button variant="outline" onClick={() => setShowChangePasswordModal(true)}>
                          Change Password
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile} loading={loading}>
                          Save Changes
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Personal Information
              </h2>

              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    {isEditing ? (
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                        className="w-full"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400">
                      <div className="break-all">{user.email}</div>
                      
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                    <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400">
                      {getRoleDisplayName(user.role)}
                      
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Account Status
                    </label>
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isVerified
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {user.isVerified ? "✓ Verified" : "⏳ Pending Verification"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Link to={getDashboardLink()}>
                  <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1 text-sm sm:text-base">
                      📊 Dashboard
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Go to your main dashboard</p>
                  </div>
                </Link>

                {user.role === "student" && (
                  <>
                    <Link to="/courses">
                      <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1 text-sm sm:text-base">
                          📚 My Courses
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          View your enrolled courses
                        </p>
                      </div>
                    </Link>
                    <Link to="/all-courses">
                      <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1 text-sm sm:text-base">
                          🌐 Browse Courses
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Discover new courses</p>
                      </div>
                    </Link>
                  </>
                )}

                {user.role === "instructor" && (
                  <>
                    <Link to="/course-form">
                      <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1 text-sm sm:text-base">
                          ➕ Create Course
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Add a new course</p>
                      </div>
                    </Link>
                    <Link to="/session-form">
                      <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1 text-sm sm:text-base">
                          🎥 Create Session
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Add a new session</p>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal isOpen={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)} title="Change Password">
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
            <Input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
            <Input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password (min 6 characters)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <Input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowChangePasswordModal(false)
                setPasswordData({
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                })
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="w-full sm:w-auto">
              Change Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ProfilePage
