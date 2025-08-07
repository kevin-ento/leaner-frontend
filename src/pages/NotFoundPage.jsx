"use client"

import { Link } from "react-router-dom"
import Button from "../components/Button"

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>

        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered
          the wrong URL.
        </p>

        <div className="space-x-4">
          <Link to="/">
            <Button>Go Home</Button>
          </Link>

          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
