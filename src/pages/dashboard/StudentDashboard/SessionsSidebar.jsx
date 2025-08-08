const SessionsSidebar = ({
  selectedCourse,
  selectedSession,
  getCourseSessions,
  setSelectedSession,
}) => {
  if (!selectedCourse) {
    return (
      <div className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sessions
          </h3>
        </div>
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">Select a course to view sessions</p>
        </div>
      </div>
    );
  }

  const courseId = selectedCourse._id || selectedCourse.id;
  const courseSessions = getCourseSessions(courseId);

  return (
    <div className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Sessions
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {selectedCourse.title}
        </p>
      </div>
      <div className="p-4">
        {courseSessions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No sessions available
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {courseSessions.map((session, index) => {
              const sessionId = session._id || session.id;
              const isSelected =
                selectedSession &&
                (selectedSession._id || selectedSession.id) === sessionId;
              return (
                <div
                  key={sessionId}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {session.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {session.description}
                      </p>
                      {session.date && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(session.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                      #{index + 1}
                    </span>
                  </div>
                  {session.videoUrl && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        📹 Video
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionsSidebar;
