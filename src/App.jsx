"use client"

import { useAuth } from "./hooks/useAuth"
import AppRoutes from "./routes/AppRoutes"
import Toast from "./components/Toast"

function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <AppRoutes />
      <Toast />
    </div>
  )
}

export default App
