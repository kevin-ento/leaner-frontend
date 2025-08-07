"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "../../components/Header"
import Button from "../../components/Button"
import Input from "../../components/Input"
import { authService } from "../../services/authService"
import { showToast } from "../../components/Toast"

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      showToast("Email is required", "error")
      return
    }

    try {
      // setLoading(true)
      await authService.forgotPassword({ email })
      showToast("OTP sent to your email! Check your inbox.", "success")

      // Redirect to reset password OTP page with email as parameter
      navigate(`/reset-password-otp?email=${encodeURIComponent(email)}`)
    } catch (error) {
      console.error("Forgot password failed:", error)
      showToast("Failed to send reset email. Please check your email address.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Forgot Password" />

      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you an OTP to reset your password
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <Button type="submit" className="w-full" loading={loading}>
                Send Reset OTP
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link to="/login" className="text-sm text-primary-600 hover:text-primary-500 block">
                ← Back to Login
              </Link>
              <div className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary-600 hover:text-primary-500">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgetPasswordPage
