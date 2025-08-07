"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { authService } from "../../services/authService"
import Button from "../../components/Button"
import Input from "../../components/Input"
import Header from "../../components/Header"
import { showToast } from "../../components/Toast"

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { userId } = useParams()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters"
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      await authService.changePassword(userId, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })
      showToast("Password changed successfully!", "success")
      navigate("/profile")
    } catch (error) {
      showToast(error.response?.data?.message || "Password change failed", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Change Password" />

      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>

          <form onSubmit={handleSubmit}>
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              error={errors.currentPassword}
              required
            />

            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              required
            />

            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            <div className="flex space-x-4">
              <Button type="submit" loading={loading}>
                Change Password
              </Button>

              <Button type="button" variant="secondary" onClick={() => navigate("/profile")}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordPage
