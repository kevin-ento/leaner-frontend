"use client"

import { useState, useEffect } from "react"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import Modal from "../../components/Modal"
import Button from "../../components/Button"
import { userService } from "../../services/userService"
import { showToast } from "../../components/Toast"

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)

  const sidebarItems = [
    {
      label: "All Users",
      path: "#",
      icon: "👥",
      onClick: () => setSidebarOpen(false),
    },
    { label: "Profile", path: "/profile", icon: "👤" },
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    let filtered = users

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredUsers(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [users, roleFilter, searchTerm])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await userService.getAllUsers()

      let usersData = []
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          usersData = response.data
        } else if (response.data.list && Array.isArray(response.data.list)) {
          usersData = response.data.list
        }
      }

      setUsers(usersData)
    } catch (error) {
      console.error("Failed to fetch users:", error)
      showToast("Failed to fetch users", "error")
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      const userId = userToDelete._id || userToDelete.id
      await userService.deleteUser(userId)
      showToast("User deleted successfully!", "success")
      setShowDeleteModal(false)
      setUserToDelete(null)
      fetchUsers()
    } catch (error) {
      console.error("Failed to delete user:", error)
      showToast("Failed to delete user", "error")
    }
  }

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await userService.updateUser(userId, { role: newRole })
      showToast("User role updated successfully!", "success")
      setEditingUser(null)
      fetchUsers()
    } catch (error) {
      console.error("Failed to update user role:", error)
      showToast("Failed to update user role", "error")
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "instructor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "student":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "admin":
        return "Administrator"
      case "instructor":
        return "Instructor"
      case "student":
        return "Student"
      default:
        return role
    }
  }

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pageNumbers = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}{" "}
          users
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-xs bg-transparent"
          >
            Previous
          </Button>

          <div className="flex gap-1">
            {startPage > 1 && (
              <>
                <Button variant="outline" size="sm" onClick={() => paginate(1)} className="text-xs bg-transparent">
                  1
                </Button>
                {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
              </>
            )}

            {pageNumbers.map((number) => (
              <Button
                key={number}
                variant={currentPage === number ? "primary" : "outline"}
                size="sm"
                onClick={() => paginate(number)}
                className={`text-xs ${currentPage !== number ? "bg-transparent" : ""}`}
              >
                {number}
              </Button>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(totalPages)}
                  className="text-xs bg-transparent"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-xs bg-transparent"
          >
            Next
          </Button>
        </div>
      </div>
    )
  }

  const renderUserCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {currentUsers.map((user) => {
        const userId = user._id || user.id
        return (
          <div
            key={userId}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mb-4">
              {editingUser === userId ? (
                <select
                  defaultValue={user.role}
                  onChange={(e) => handleUpdateUserRole(userId, e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Administrator</option>
                </select>
              ) : (
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}
                >
                  {getRoleDisplayName(user.role)}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {editingUser === userId ? (
                <Button size="sm" variant="secondary" onClick={() => setEditingUser(null)} className="flex-1 text-xs">
                  Cancel
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingUser(userId)}
                  className="flex-1 text-xs bg-transparent"
                >
                  Edit Role
                </Button>
              )}
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  setUserToDelete(user)
                  setShowDeleteModal(true)
                }}
                className="flex-1 text-xs"
              >
                Delete
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )

  const renderUserTable = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentUsers.map((user) => {
              const userId = user._id || user.id
              return (
                <tr key={userId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {editingUser === userId ? (
                      <select
                        defaultValue={user.role}
                        onChange={(e) => handleUpdateUserRole(userId, e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Administrator</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {getRoleDisplayName(user.role)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {editingUser === userId ? (
                        <Button size="sm" variant="secondary" onClick={() => setEditingUser(null)} className="text-xs">
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingUser(userId)}
                          className="text-xs bg-transparent"
                        >
                          Edit Role
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          setUserToDelete(user)
                          setShowDeleteModal(true)
                        }}
                        className="text-xs"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

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
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User Management</h2>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
          {/* Header and Filters */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage user accounts and permissions</p>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Users: {filteredUsers.length}</div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="sm:w-48">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="instructor">Instructors</option>
                  <option value="admin">Administrators</option>
                </select>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
              <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                <button
                  onClick={() => setCurrentPage(1)}
                  className="px-3 py-1 text-xs bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cards
                </button>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="px-3 py-1 text-xs bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500"
                >
                  Table
                </button>
              </div>
            </div>
          </div>

          {/* Users Display */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl sm:text-3xl">👥</span>
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                {searchTerm || roleFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No users are registered yet."}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile: Cards, Desktop: Table */}
              <div className="block sm:hidden">{renderUserCards()}</div>
              <div className="hidden sm:block">{renderUserTable()}</div>

              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </main>
      </div>

      {/* Delete User Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete User">
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Are you sure you want to delete user "{userToDelete?.name}"? This action cannot be undone.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button variant="danger" onClick={handleDeleteUser} className="flex-1">
            Delete User
          </Button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="flex-1">
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default AdminDashboard
