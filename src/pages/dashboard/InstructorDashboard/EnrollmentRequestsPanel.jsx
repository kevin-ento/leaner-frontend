import Button from "../../../components/Button";
import Panel from "../../../components/Panel";
import EmptyState from "../../../components/EmptyState";

const EnrollmentRequestsPanel = ({
  enrollmentRequests,
  onApproveEnrollment,
  onRejectEnrollment,
  enrollmentLoading = {},
}) => {
  return (
    <Panel title="Enrollment Requests" count={enrollmentRequests.length}>
      {enrollmentRequests.length === 0 ? (
        <EmptyState icon="📝" subtitle="No pending enrollment requests." />
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {enrollmentRequests.map((enrollment) => {
            const enrollmentId = enrollment._id || enrollment.id;
            const studentName = enrollment.studentId?.name || "Unknown Student";
            const studentEmail = enrollment.studentId?.email || "No email";
            const isLoading = enrollmentLoading[enrollmentId];
            
            return (
              <div
                key={enrollmentId}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {studentName}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {studentEmail}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Requested: {new Date(enrollment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onApproveEnrollment(enrollmentId)}
                      className="flex-1 text-xs"
                      loading={isLoading}
                      disabled={isLoading}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onRejectEnrollment(enrollmentId)}
                      className="flex-1 text-xs"
                      loading={isLoading}
                      disabled={isLoading}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
};

export default EnrollmentRequestsPanel;
