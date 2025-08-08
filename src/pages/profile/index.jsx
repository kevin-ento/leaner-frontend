"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";
import { authService } from "../../services/authService";
import { showToast } from "../../components/Toast";
import { getDashboardLink } from "../../utils/getDashboardRoute";
import { routes } from "../../constants/routes";
import ProfileHeader from "./ProfileHeader";
import PersonalInformation from "./PersonalInformation";
import QuickLinksSidebar from "./QuickLinksSidebar";
import ChangePasswordModal from "./ChangePasswordModal";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { user, updateUser } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Name cannot be empty", "error");
      return;
    }
    if (formData.name.trim().length < 2) {
      showToast("Name must be at least 2 characters long", "error");
      return;
    }

    try {
      setLoading(true);
      const userId = user._id || user.id;
      await userService.updateProfile(userId, { name: formData.name.trim() });
      updateUser({ name: formData.name.trim() });
      setIsEditing(false);
      showToast("Profile updated successfully!", "success");
    } catch (error) {
      console.error("Failed to update profile:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update profile. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validation
    if (!passwordData.oldPassword) {
      showToast("Current password is required", "error");
      return;
    }
    if (!passwordData.newPassword) {
      showToast("New password is required", "error");
      return;
    }
    if (!passwordData.confirmPassword) {
      showToast("Please confirm your new password", "error");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast("New password must be at least 6 characters long", "error");
      return;
    }
    if (passwordData.oldPassword === passwordData.newPassword) {
      showToast(
        "New password must be different from current password",
        "error"
      );
      return;
    }

    try {
      setLoading(true);
      const userId = user._id || user.id;
      await authService.changePassword(userId, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowChangePasswordModal(false);
      showToast("Password changed successfully!", "success");
    } catch (error) {
      console.error("Failed to change password:", error);
      let errorMessage = "Failed to change password. Please try again.";
      if (error.response?.status === 400) {
        errorMessage =
          error.response?.data?.message || "Current password is incorrect";
      } else if (error.response?.status === 404) {
        errorMessage = "User not found";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
    });
    setIsEditing(false);
  };

  const dashboardLink = getDashboardLink(user);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="My Profile" />
      <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link to={dashboardLink}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm bg-transparent"
            >
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Mobile Profile Header */}
        <ProfileHeader
          user={user}
          isEditing={isEditing}
          loading={loading}
          onEdit={() => setIsEditing(true)}
          onCancel={handleCancel}
          onSave={handleSaveProfile}
          onChangePassword={() => setShowChangePasswordModal(true)}
          isMobile={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2">
            {/* Desktop Profile Header */}
            <ProfileHeader
              user={user}
              isEditing={isEditing}
              loading={loading}
              onEdit={() => setIsEditing(true)}
              onCancel={handleCancel}
              onSave={handleSaveProfile}
              onChangePassword={() => setShowChangePasswordModal(true)}
              isMobile={false}
            />

            {/* Profile Form */}
            <PersonalInformation
              user={user}
              isEditing={isEditing}
              formData={formData}
              onInputChange={handleInputChange}
            />
          </div>

          {/* Sidebar */}
          <QuickLinksSidebar user={user} dashboardLink={dashboardLink} />
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        passwordData={passwordData}
        loading={loading}
        onPasswordChange={handlePasswordChange}
        onSubmit={handleChangePassword}
        onCancel={() => {
          setShowChangePasswordModal(false);
          setPasswordData({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }}
      />
    </div>
  );
};

export default ProfilePage;
