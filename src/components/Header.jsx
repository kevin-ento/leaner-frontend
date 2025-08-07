"use client"

import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { Link } from "react-router-dom"
import Button from "./Button"

const Header = ({ title }) => {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getDashboardLink = () => {
    if (!user) return "/"

    switch (user.role) {
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

  const getQuickLinks = () => {
    if (!user) return []

    const baseLinks = [{ label: "Profile", path: "/profile", icon: "👤" }]

    switch (user.role) {
      case "student":
        return [
          { label: "Dashboard", path: "/dashboard", icon: "📊" },
          { label: "My Courses", path: "/courses", icon: "📚" },
          { label: "Browse Courses", path: "/all-courses", icon: "🌐" },
          ...baseLinks,
        ]
      case "instructor":
        return [
          { label: "Dashboard", path: "/instructor-dashboard", icon: "📊" },
          { label: "Create Course", path: "/create-course", icon: "➕" },
          { label: "Add Session", path: "/add-session", icon: "🎥" },
          ...baseLinks,
        ]
      case "admin":
        return [{ label: "Dashboard", path: "/admin-dashboard", icon: "📊" }, ...baseLinks]
      default:
        return baseLinks
    }
  }

  const quickLinks = getQuickLinks()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left Section - Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            <Link to={getDashboardLink()} className="flex items-center space-x-2 flex-shrink-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                Learner
              </h1>
            </Link>

            {title && (
              <>
                <span className="text-gray-400 dark:text-gray-500 hidden sm:block">|</span>
                <div className="min-w-0 flex-1 sm:flex-none">
                  <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 truncate">{title}</p>
                </div>
              </>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Quick Links */}
            <nav className="flex items-center space-x-1">
              {quickLinks.slice(0, 3).map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <span className="mr-1">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* User Info */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-32">
                  {user?.name || user?.email}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</div>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="bg-transparent">
                Logout
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 relative z-30"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-3 space-y-1">
            {/* User Info Section */}
            <div className="pb-3 mb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name || user?.email}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <span className="mr-3 text-base">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Logout Button */}
            <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout()
                  setMobileMenuOpen(false)
                }}
                className="w-full bg-transparent"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </header>
  )
}

export default Header
