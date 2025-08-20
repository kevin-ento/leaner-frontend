import { memo } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import { routes } from "../../../constants/routes";
import CourseDetails from "./CourseDetails";
import VideoPlayer from "./VideoPlayer";

const MainContent = memo(({
  selectedCourse,
  selectedSession,
  enrolledCourses,
  getCourseSessions,
  setSelectedSession,
  onBackToCourse,
}) => {
  if (!selectedCourse) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] transition-all duration-300">
        <div className="text-center p-8 max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Select a Course
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
            Choose a course from the sidebar to view its content and start learning
          </p>
          {enrolledCourses.length === 0 && (
            <Link to={routes.allCourses}>
              <Button 
                size="lg"
                className="shadow-md"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              >
                Browse All Courses
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  // If no session is selected, show course details
  if (!selectedSession) {
    return (
      <div className="transition-all duration-300 animate-fade-in">
        <CourseDetails
          course={selectedCourse}
          getCourseSessions={getCourseSessions}
          setSelectedSession={setSelectedSession}
        />
      </div>
    );
  }

  // Show selected session with video
  return (
    <div className="space-y-6 animate-scale-in">
      {/* Session Navigation */}
      <div className="bg-white dark:bg-gray-800 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {selectedSession.title}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-base leading-relaxed">
              {selectedSession.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="font-medium">{selectedCourse.title}</span>
              </div>
              {selectedSession.date && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(selectedSession.date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={onBackToCourse}
              className="shadow-md"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              }
            >
              Back to Course
            </Button>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="bg-white dark:bg-gray-800 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <VideoPlayer session={selectedSession} />
      </div>
    </div>
  );
});

MainContent.displayName = 'MainContent';

export default MainContent;
