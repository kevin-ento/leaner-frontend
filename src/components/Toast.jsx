"use client"

import { useState, useCallback, useEffect } from "react"

// Create a toast context using a custom event system
const toastEventTarget = new EventTarget()
const TOAST_EVENT = 'show-toast'

// Global function to show toast
export const showToast = (message, type = "info") => {
  const event = new CustomEvent(TOAST_EVENT, { 
    detail: { message, type } 
  })
  toastEventTarget.dispatchEvent(event)
}

const Toast = () => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handleToast = (event) => {
      const { message, type } = event.detail
      const id = Date.now()
      const newToast = { id, message, type }

      setToasts((prev) => [...prev, newToast])

      // Auto-remove toast after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, 5000)
    }

    toastEventTarget.addEventListener(TOAST_EVENT, handleToast)
    
    return () => {
      toastEventTarget.removeEventListener(TOAST_EVENT, handleToast)
    }
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const getToastStyles = useCallback((type) => {
    const baseStyles = "p-4 rounded-lg shadow-lg border-l-4 max-w-sm"

    switch (type) {
      case "success":
        return `${baseStyles} bg-green-50 border-green-400 text-green-800`
      case "error":
        return `${baseStyles} bg-red-50 border-red-400 text-red-800`
      case "warning":
        return `${baseStyles} bg-yellow-50 border-yellow-400 text-yellow-800`
      default:
        return `${baseStyles} bg-blue-50 border-blue-400 text-blue-800`
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div key={toast.id} className={`${getToastStyles(toast.type)} animate-slide-in`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Toast
