"use client"

import { useEffect, useCallback } from "react"

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const handleEscape = useCallback((e) => {
    if (e.key === "Escape") {
      onClose()
    }
  }, [onClose])

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  const sizes = {
    sm: "max-w-sm sm:max-w-md",
    md: "max-w-md sm:max-w-lg",
    lg: "max-w-lg sm:max-w-2xl",
    xl: "max-w-xl sm:max-w-4xl",
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={handleBackdropClick}
        ></div>

        <div
          className={`inline-block w-full ${sizes[size]} p-4 sm:p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700`}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none p-1 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-sm sm:text-base">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Modal
