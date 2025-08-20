"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { authService } from "../../services/authService";
import { showToast } from "../../components/Toast";
import { routes } from "../../constants/routes";
import LoadingScreen from "../../components/LoadingScreen";

const ResetPasswordOtpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from URL params if available
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      setFormData((prev) => ({
        ...prev,
        email: emailFromParams,
      }));
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.otp ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      showToast("All fields are required", "error");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (formData.newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      showToast(
        "Password reset successfully! Please login with your new password.",
        "success"
      );
      navigate(routes.login);
    } catch (error) {
      console.error("Password reset failed:", error);
      showToast(
        "Password reset failed. Please check your OTP and try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!formData.email) {
      showToast("Please enter your email address", "error");
      return;
    }

    try {
      setResendLoading(true);
      await authService.forgotPassword({ email: formData.email });
      showToast("New OTP sent to your email", "success");
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      showToast("Failed to resend OTP", "error");
    } finally {
      setResendLoading(false);
    }
  };

  if (loading) return <LoadingScreen message="Verifying OTP..." />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Reset Password" />

      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reset Your Password
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter the OTP sent to your email and set a new password
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  disabled={!!searchParams.get("email")} // Disable if email comes from URL
                />
              </div>

              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  OTP Code
                </label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  value={formData.otp}
                  onChange={handleInputChange}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                />
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-sm text-primary-600 hover:text-primary-500 disabled:opacity-50"
                    disabled={loading || resendLoading}
                  >
                    {resendLoading ? "Resending..." : "Resend OTP"}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  New Password
                </label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <Button type="submit" className="w-full" loading={loading}>
                Reset Password
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to={routes.login}
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordOtpPage;
