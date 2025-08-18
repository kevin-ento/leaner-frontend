import { Link } from "react-router-dom";
import { routes } from "../../constants/routes";

const QuickLinksSidebar = ({ user, dashboardLink }) => {
  // Quick links are assembled below based on the user's role

  const getRoleSpecificLinks = () => {
    const links = [];

    if (user.role === "student") {
      links.push(
        {
          title: "📚 My Courses",
          description: "View your enrolled courses",
          path: routes.myCourses,
        },
        {
          title: "🌐 Browse Courses",
          description: "Discover new courses",
          path: routes.allCourses,
        }
      );
    }

    if (user.role === "instructor") {
      links.push(
        {
          title: "➕ Create Course",
          description: "Add a new course",
          path: "/create-course",
        },
        {
          title: "🎥 Create Session",
          description: "Add a new session",
          path: "/add-session",
        }
      );
    }

    return links;
  };

  const roleSpecificLinks = getRoleSpecificLinks();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Quick Links */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Links
        </h2>
        <div className="space-y-2">
          <Link to={dashboardLink}>
            <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <h3 className="font-medium text-gray-900 dark:text-white mb-1 text-sm sm:text-base">
                📊 Dashboard
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Go to your main dashboard
              </p>
            </div>
          </Link>
          {roleSpecificLinks.map((link, index) => (
            <Link key={index} to={link.path}>
              <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1 text-sm sm:text-base">
                  {link.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {link.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickLinksSidebar;
