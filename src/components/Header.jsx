"use client";

import { useState, memo, useCallback, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import { getDashboardLink } from "../utils/getDashboardRoute";
import { getQuickLinks } from "../utils/getQuickLinks";
import { routes } from "../constants/routes";

const Header = memo(({ title }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Memoize expensive computations
  const dashboardLink = useMemo(() => getDashboardLink(user), [user]);
  const quickLinks = useMemo(() => getQuickLinks(user), [user]);

  const getLogoLink = useCallback(() => {
    if (!user) return routes.home;
    
    // Check if we're on a course-specific route
    if (location.pathname.includes('/instructor-dashboard/') && user.role === 'instructor') {
      return routes.instructor; // Go to main instructor dashboard
    }
    if (location.pathname.includes('/dashboard/') && user.role === 'student') {
      return routes.student; // Go to main student dashboard
    }
    if (location.pathname.includes('/admin-dashboard/') && user.role === 'admin') {
      return routes.admin; // Go to main admin dashboard
    }
    
    // Default to role dashboard
    return dashboardLink;
  }, [user, location.pathname, dashboardLink]);

  const logoLink = useMemo(() => getLogoLink(), [getLogoLink]);

  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setMobileMenuOpen(false);
  }, [logout]);

  const userInitial = useMemo(() => 
    user?.name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U", 
    [user?.name, user?.email]
  );

  const userName = useMemo(() => 
    user?.name || user?.email, 
    [user?.name, user?.email]
  );

  return (
    <header className="bg-white dark:bg-gray-900 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Left Section - Logo and Title */}
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <Link
              to={logoLink}
              className="flex items-center space-x-2 flex-shrink-0 group"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-600 dark:text-primary-400">
                Learner
              </h1>
            </Link>
            {title && (
              <>
                <div className="hidden sm:block w-px h-6 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                <div className="min-w-0 flex-1 sm:flex-none">
                  <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-700 dark:text-gray-300 truncate">
                    {title}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Quick Links */}
            <nav className="flex items-center space-x-1">
              {quickLinks.slice(0, 3).map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* User Info + Theme */}
            <div className="flex items-center space-x-4 pl-6 border-l border-gray-200 dark:border-gray-700">
              <ThemeToggle />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-medium">
                    {userInitial}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-32">
                    {userName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  }
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleMobileMenuToggle}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
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
          className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 backdrop-blur-md relative z-30 animate-slide-down"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-4 space-y-3">
            {/* User Info Section */}
            <div className="pb-3 mb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-lg font-medium">
                    {userInitial}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-gray-900 dark:text-white truncate">
                    {userName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  onClick={handleMobileMenuClose}
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  <span className="mr-3 text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Logout Button */}
            <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                size="lg"
                onClick={handleLogout}
                className="w-full bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                }
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-600 dark:bg-gray-800 lg:hidden animate-fade-in"
          onClick={handleMobileMenuClose}
        ></div>
      )}
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
