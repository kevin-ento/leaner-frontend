import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import { routes } from "../../../constants/routes";
import CourseDetails from "./CourseDetails";
import VideoPlayer from "./VideoPlayer";

const MainContent = ({
  selectedCourse,
  selectedSession,
  enrolledCourses,
  getCourseSessions,
  setSelectedSession,
}) => {
  if (!selectedCourse) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Select a Course
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm sm:text-base">
            Choose a course from the sidebar to view its content
          </p>
          {enrolledCourses.length === 0 && (
            <Link to={routes.allCourses}>
              <Button>Browse All Courses</Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  // If no session is selected, show course details
  if (!selectedSession) {
    return (
      <CourseDetails
        course={selectedCourse}
        getCourseSessions={getCourseSessions}
        setSelectedSession={setSelectedSession}
      />
    );
  }

  // Show selected session with video
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Session Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {selectedSession.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm sm:text-base">
            {selectedSession.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Course: {selectedCourse.title}</span>
            {selectedSession.date && (
              <span>
                Date: {new Date(selectedSession.date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedSession(null)}
            className="text-xs sm:text-sm"
          >
            ← Back to Course
          </Button>
        </div>
      </div>

      <VideoPlayer session={selectedSession} />

      {selectedSession.videoUrl && (
        <div className="flex items-center justify-between">
          <a
            href={selectedSession.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            Open in YouTube
          </a>
        </div>
      )}
    </div>
  );
};

export default MainContent;
