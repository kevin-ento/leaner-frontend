"use client"

import { useAuth } from "./hooks/useAuth"
import AppRoutes from "./routes/AppRoutes"
import { ThemeProvider } from "./context/ThemeContext"
import Toast from "./components/Toast"

function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <div>
        <AppRoutes />
        <Toast />
      </div>
    </ThemeProvider>
  )
}

export default App
