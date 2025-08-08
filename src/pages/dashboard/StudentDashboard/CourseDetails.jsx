import Button from "../../../components/Button";

const CourseDetails = ({ course, getCourseSessions, setSelectedSession }) => {
  const courseId = course._id || course.id;
  const courseSessions = getCourseSessions(courseId);
  const instructorName = course.instructorId?.name || "Unknown Instructor";

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
          {course.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>👨‍🏫 Instructor: {instructorName}</span>
          <span>📚 Category: {course.category}</span>
          <span>🎥 {courseSessions.length} Sessions</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Course Description
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
          {course.description}
        </p>
      </div>

      {courseSessions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Course Sessions
          </h2>
          <div className="space-y-3">
            {courseSessions.map((session, index) => (
              <div
                key={session._id || session.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => setSelectedSession(session)}
              >
                <div className="flex-1 mb-3 sm:mb-0">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                    {session.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {session.description}
                  </p>
                  {session.date && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Session {index + 1}
                  </span>
                  {session.videoUrl && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs rounded-full">
                      📹 Video
                    </span>
                  )}
                  <Button size="sm" className="text-xs sm:text-sm">
                    Watch
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
