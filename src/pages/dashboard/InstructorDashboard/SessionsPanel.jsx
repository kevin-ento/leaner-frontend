import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import { routes } from "../../../constants/routes";
import { getEntityId } from "../../../utils/apiHelpers";
import Panel from "../../../components/Panel";
import EmptyState from "../../../components/EmptyState";

const SessionsPanel = ({ courseId, sessions, onDeleteSession, loading = false }) => {
  if (loading) {
    return (
      <Panel
        title="Sessions"
        count={0}
        actions={
          <Link to={`${routes.addSession}?courseId=${courseId}`}>
            <Button size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
              Add Session
            </Button>
          </Link>
        }
      >
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      title="Sessions"
      count={sessions.length}
      actions={
        <Link to={`${routes.addSession}?courseId=${courseId}`}>
          <Button size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
            Add Session
          </Button>
        </Link>
      }
    >
      {sessions.length === 0 ? (
        <EmptyState
          icon="🎥"
          subtitle="No sessions created yet."
          action={
            <Link to={`${routes.addSession}?courseId=${courseId}`}>
              <Button size="sm" className="text-xs sm:text-sm">
                Create First Session
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sessions.map((session) => {
            const sessionId = getEntityId(session);
            const sessionDate = session.date || session.scheduledAt;
            return (
              <div
                key={sessionId}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base line-clamp-2">
                      {session.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {session.description}
                    </p>
                    {session.videoUrl && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        <a
                          href={session.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📹 Video Link
                        </a>
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {sessionDate
                          ? new Date(sessionDate).toLocaleDateString()
                          : "No date"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`${routes.editSession(sessionId)}?courseId=${courseId}`} className="flex-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs bg-transparent"
                      >
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDeleteSession(sessionId)}
                      className="text-xs"
                    >
                      Delete
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

export default SessionsPanel;
