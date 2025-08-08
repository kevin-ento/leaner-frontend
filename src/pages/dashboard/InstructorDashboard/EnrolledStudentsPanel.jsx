import Panel from "../../../components/Panel";
import EmptyState from "../../../components/EmptyState";

const EnrolledStudentsPanel = ({ enrolledStudents }) => {
  return (
    <Panel title="Enrolled Students" count={enrolledStudents.length}>
      {enrolledStudents.length === 0 ? (
        <EmptyState icon="👥" subtitle="No enrolled students yet." />
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {enrolledStudents.map((enrollment) => {
            const enrollmentId = enrollment._id || enrollment.id;
            const studentName = enrollment.studentId?.name || "Unknown Student";
            const studentEmail = enrollment.studentId?.email || "No email";
            return (
              <div
                key={enrollmentId}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {studentName}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {studentEmail}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full whitespace-nowrap">
                    Active
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
};

export default EnrolledStudentsPanel;
