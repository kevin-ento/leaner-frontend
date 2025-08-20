"use client";

import { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { userService } from "../../../services/userService";
import { showToast } from "../../../components/Toast";
import UserFilters from "./UserFilters";
import ViewToggle from "./ViewToggle";
import UserCard from "./UserCard";
import UserTable from "./UserTable";
import Pagination from "./Pagination";
import DeleteUserModal from "./DeleteUserModal";
import { extractArray, getEntityId } from "../../../utils/apiHelpers";
import { routes } from "../../../constants/routes";
import EmptyState from "../../../components/EmptyState";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("cards");
  const [usersPerPage] = useState(10);

  const sidebarItems = [
    {
      label: "All Users",
      path: "#",
      icon: "👥",
      onClick: () => setSidebarOpen(false),
    },
    { label: "Profile", path: routes.profile, icon: "👤" },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, roleFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      const usersData = extractArray(response);
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      showToast("Failed to fetch users", "error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setDeleteLoading(true);
      const userId = getEntityId(userToDelete);
      await userService.deleteUser(userId);
      
      // Update local state immediately instead of refetching
      setUsers(prev => prev.filter(user => getEntityId(user) !== userId));
      
      showToast("User deleted successfully!", "success");
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
      showToast("Failed to delete user", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Skeleton loading component
  const DashboardSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Admin Dashboard" />

      {/* Mobile Header with Menu Toggle */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User Management</h2>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 min-h-screen">
          <Sidebar items={sidebarItems} />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
              </div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
            </div>

            {/* Filters Skeleton */}
            <div className="space-y-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full sm:w-64 animate-pulse"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full sm:w-32 animate-pulse"></div>
              </div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
            </div>
          </div>

          {/* Users Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Admin Dashboard" />

      {/* Mobile Header with Menu Toggle */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            User Management
          </h2>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <Sidebar items={sidebarItems} className="h-full" />
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 min-h-screen">
          <Sidebar items={sidebarItems} />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  User Management
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  View user accounts and manage permissions
                </p>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Users: {filteredUsers.length}
              </div>
            </div>

            <UserFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
            />

            <ViewToggle
              viewMode={viewMode}
              setViewMode={setViewMode}
              setCurrentPage={setCurrentPage}
            />
          </div>

          {/* Users Display */}
          {filteredUsers.length === 0 ? (
            <EmptyState
              icon="👥"
              title="No users found"
              subtitle={
                searchTerm || roleFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No users are registered yet."
              }
            />
          ) : (
            <>
              {viewMode === "cards" ? (
                <UserCard
                  users={currentUsers}
                  handleDeleteClick={handleDeleteClick}
                />
              ) : (
                <UserTable
                  users={currentUsers}
                  handleDeleteClick={handleDeleteClick}
                />
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                usersPerPage={usersPerPage}
                filteredUsers={filteredUsers}
                indexOfFirstUser={indexOfFirstUser}
                indexOfLastUser={indexOfLastUser}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </main>
      </div>

      <DeleteUserModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        userToDelete={userToDelete}
        onConfirm={handleDeleteUser}
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminDashboard;
