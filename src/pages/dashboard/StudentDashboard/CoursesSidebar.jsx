import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import { routes } from "../../../constants/routes";

const CoursesSidebar = ({
  enrolledCourses,
  allCourses,
  selectedCourse,
  getCourseSessions,
  getEnrollmentStatus,
  enrolling,
  onCourseSelect,
  onEnroll,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          My Courses
        </h3>
      </div>
      <div className="p-4">
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
              No enrolled courses yet
            </p>
            <Link to={routes.allCourses}>
              <Button size="sm" className="text-xs">
                Browse Courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {enrolledCourses.map((course) => {
              const courseId = course._id || course.id;
              const courseSessions = getCourseSessions(courseId);
              const isSelected =
                selectedCourse &&
                (selectedCourse._id || selectedCourse.id) === courseId;
              return (
                <div
                  key={courseId}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => onCourseSelect(course)}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {course.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {courseSessions.length} sessions
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Category: {course.category}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Browse All Courses Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Available Courses
        </h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {allCourses
            .filter((course) => {
              const courseId = course._id || course.id;
              const enrollmentStatus = getEnrollmentStatus(courseId);
              return !enrollmentStatus || enrollmentStatus === "rejected";
            })
            .slice(0, 5)
            .map((course) => {
              const courseId = course._id || course.id;
              const instructorName =
                course.instructorId?.name || "Unknown Instructor";
              return (
                <div
                  key={courseId}
                  className="p-2 border border-gray-200 dark:border-gray-600 rounded text-xs"
                >
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    {course.title}
                  </h5>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    by {instructorName}
                  </p>
                  <Button
                    size="sm"
                    className="mt-2 text-xs py-1 px-2"
                    onClick={() => onEnroll(courseId)}
                    loading={enrolling[courseId]}
                  >
                    Enroll
                  </Button>
                </div>
              );
            })}
        </div>
        <Link to={routes.allCourses} className="block mt-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs bg-transparent"
          >
            View All Courses
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CoursesSidebar;
