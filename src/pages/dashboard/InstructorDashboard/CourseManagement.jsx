import Button from "../../../components/Button";
import SessionsPanel from "./SessionsPanel";
import EnrolledStudentsPanel from "./EnrolledStudentsPanel";
import EnrollmentRequestsPanel from "./EnrollmentRequestsPanel";
import { getEntityId } from "../../../utils/apiHelpers";

const CourseManagement = ({
  selectedCourse,
  sessions,
  enrollmentRequests,
  enrolledStudents,
  onBack,
  onApproveEnrollment,
  onRejectEnrollment,
  onDeleteSession,
}) => {
  const courseId = getEntityId(selectedCourse);

  const courseSessions = sessions.filter(
    (s) => getEntityId(s.courseId) === courseId
  );

  const courseEnrollments = enrollmentRequests.filter(
    (e) => getEntityId(e.courseId) === courseId
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white line-clamp-2">
            Managing: {selectedCourse.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Course Management Dashboard
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={onBack}
          className="w-full sm:w-auto text-sm sm:text-base"
        >
          ← Back to Courses
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <SessionsPanel
          courseId={courseId}
          sessions={courseSessions}
          onDeleteSession={onDeleteSession}
        />

        <EnrolledStudentsPanel enrolledStudents={enrolledStudents} />

        <EnrollmentRequestsPanel
          enrollmentRequests={courseEnrollments}
          onApproveEnrollment={onApproveEnrollment}
          onRejectEnrollment={onRejectEnrollment}
        />
      </div>
    </div>
  );
};

export default CourseManagement;
