import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import { routes } from "../../../constants/routes";
import { getEntityId } from "../../../utils/apiHelpers";

const CourseCard = ({
  course,
  sessions,
  enrollmentRequests,
  onManage,
  onDelete,
}) => {
  const courseId = getEntityId(course);

  const courseSessions = sessions.filter(
    (s) => getEntityId(s.courseId) === courseId
  );

  const courseEnrollments = enrollmentRequests.filter(
    (e) => getEntityId(e.courseId) === courseId
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 overflow-hidden">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {course.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-3">
        {course.description}
      </p>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
        Category: {course.category}
      </p>
      {course.instructorId && typeof course.instructorId === "object" && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
          Instructor: {course.instructorId.name}
        </p>
      )}
      <div className="flex items-center justify-between mb-4 text-xs sm:text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          {courseSessions.length} sessions
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          {courseEnrollments.length} pending
        </span>
      </div>
      <div className="flex flex-col gap-2 min-w-0">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onManage(course)}
          className="w-full text-xs sm:text-sm lg:text-base truncate"
        >
          Manage
        </Button>
        <div className="grid grid-cols-2 gap-2 min-w-0">
          <Link to={routes.editCourse(courseId)} className="min-w-0">
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs sm:text-sm lg:text-base bg-transparent truncate"
            >
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(course)}
            className="w-full text-xs sm:text-sm lg:text-base truncate"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
