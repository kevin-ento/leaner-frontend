import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import { routes } from "../../../constants/routes";

const QuickActionsBar = ({
  user,
  selectedCourse,
  selectedSession,
  sidebarOpen,
  setSidebarOpen,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Welcome back, {user?.name || "Student"}!
          </h2>
          {selectedCourse && (
            <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">
              • Currently viewing: {selectedCourse.title}
              {selectedSession && ` → ${selectedSession.title}`}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link to={routes.allCourses}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm bg-transparent"
            >
              🌐 Browse Courses
            </Button>
          </Link>
          <Link to={routes.myCourses}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm bg-transparent"
            >
              📚 My Courses
            </Button>
          </Link>
          <Link to={routes.profile}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm bg-transparent"
            >
              👤 Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsBar;
