"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { authService } from "../../services/authService"
import { useAuth } from "../../hooks/useAuth"
import Button from "../../components/Button"
import Input from "../../components/Input"
import { showToast } from "../../components/Toast"

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const email = location.state?.email

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!otp) {
      setError("OTP is required")
      return
    }

    if (!email) {
      setError("Email is missing. Please go back to registration.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await authService.verifyOtp({ email, otp })
      showToast("Email verified successfully!", "success")

      // Check if the response contains token and user data
      if (response.data && (response.data.token || response.data.access_token)) {
        // Auto-login the user with the received token and user data
        const token = response.data.token || response.data.access_token
        const userData = response.data.user

        // Store token and set user data
        localStorage.setItem("token", token)

        // Use the login function to set the auth state
        const loginResult = await login({
          email,
          token: token,
          user: userData,
        })

        if (loginResult.success) {
          // Redirect to appropriate dashboard based on user role
          const dashboardPath =
            userData?.role === "instructor"
              ? "/instructor-dashboard"
              : userData?.role === "admin"
                ? "/admin-dashboard"
                : "/dashboard"

          navigate(dashboardPath, { replace: true })
        } else {
          showToast("Login failed after verification. Please login manually.", "error")
          navigate("/login")
        }
      } else {
        // If no token in response, redirect to login
        showToast("Verification successful! Please login with your credentials.", "success")
        navigate("/login")
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      const errorMessage =
        error.response?.data?.message || error.message || "Verification failed. Please check your OTP and try again."
      setError(errorMessage)
      showToast(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!email) {
      setError("Email is missing. Please go back to registration.")
      return
    }

    try {
      setLoading(true)
      await authService.forgotPassword(email)
      showToast("OTP resent successfully!", "success")
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to resend OTP"
      showToast(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Verify Your Email</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            We've sent a verification code to <span className="font-medium">{email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="card p-6">
            <Input
              label="Verification Code"
              name="otp"
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value)
                setError("")
              }}
              error={error}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
            />

            <div className="flex flex-col space-y-3">
              <Button type="submit" loading={loading} className="w-full">
                {loading ? "Verifying..." : "Verify Email"}
              </Button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 disabled:opacity-50"
              >
                Didn't receive the code? Resend OTP
              </button>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Back to Registration
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VerifyOtpPage
