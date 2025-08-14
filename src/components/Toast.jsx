"use client"

import { useState, useEffect } from "react"

let showToast = () => {}

const Toast = () => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    showToast = (message, type = "info") => {
      const id = Date.now()
      const newToast = { id, message, type }

      setToasts((prev) => [...prev, newToast])

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, 5000)
    }
  }, [])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const getToastStyles = (type) => {
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
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div key={toast.id} className={`${getToastStyles(toast.type)} animate-slide-in`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="ml-4 text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export { showToast }
export default Toast
