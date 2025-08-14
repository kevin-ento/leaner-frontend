"use client"

import { NavLink } from "react-router-dom"

const Sidebar = ({ items, className = "" }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 ${className}`}>
      <nav className="mt-4">
        {items.map((item, index) => {
          if (item.onClick) {
            return (
              <button
                key={index}
                onClick={item.onClick}
                className="sidebar-item w-full text-left flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 cursor-pointer"
              >
                {item.icon && <span className="mr-3 text-base sm:text-lg">{item.icon}</span>}
                <span className="text-sm sm:text-base">{item.label}</span>
              </button>
            )
          }

          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-item flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "active bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 border-r-2 border-primary-600 dark:border-primary-400"
                    : ""
                }`
              }
            >
              {item.icon && <span className="mr-3 text-base sm:text-lg">{item.icon}</span>}
              <span className="text-sm sm:text-base">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar
