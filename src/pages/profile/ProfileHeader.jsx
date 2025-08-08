import Button from "../../components/Button";
import { getRoleDisplayName } from "../../utils/getRoleDisplayName";

const ProfileHeader = ({
  user,
  isEditing,
  loading,
  onEdit,
  onCancel,
  onSave,
  onChangePassword,
  isMobile,
}) => {
  const getRoleColor = (role) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "instructor":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const containerClass = isMobile
    ? "block lg:hidden mb-6"
    : "hidden lg:block mb-6";

  const headerClass = isMobile
    ? "text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2"
    : "text-3xl font-bold text-gray-900 dark:text-white mb-2";

  const avatarClass = isMobile
    ? "w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center"
    : "w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center";

  const avatarTextClass = isMobile
    ? "text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400"
    : "text-2xl font-bold text-primary-600 dark:text-primary-400";

  const badgeClass = isMobile
    ? "px-2 py-1 rounded-full text-xs font-medium"
    : "px-3 py-1 rounded-full text-sm font-medium";

  const verifiedBadgeClass = isMobile
    ? "px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium"
    : "px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium";

  return (
    <div className={containerClass}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
        <div
          className={
            isMobile
              ? "flex flex-col sm:flex-row items-center sm:items-start gap-4"
              : "flex items-start justify-between mb-6"
          }
        >
          <div
            className={
              isMobile
                ? "flex flex-col sm:flex-row items-center sm:items-start gap-4"
                : "flex items-center gap-6"
            }
          >
            <div className={avatarClass}>
              <span className={avatarTextClass}>
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className={isMobile ? "text-center sm:text-left flex-1" : ""}>
              <h1 className={headerClass}>{user.name}</h1>
              <div
                className={
                  isMobile
                    ? "flex flex-wrap justify-center sm:justify-start items-center gap-2"
                    : "flex items-center gap-3"
                }
              >
                <span className={`${badgeClass} ${getRoleColor(user.role)}`}>
                  {getRoleDisplayName(user.role)}
                </span>
                {user.isVerified && (
                  <span className={verifiedBadgeClass}>✓ Verified</span>
                )}
              </div>
            </div>
          </div>
          {!isMobile && (
            <div className="flex gap-3">
              {!isEditing ? (
                <>
                  <Button variant="outline" onClick={onEdit}>
                    Edit Name
                  </Button>
                  <Button variant="outline" onClick={onChangePassword}>
                    Change Password
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button onClick={onSave} loading={loading}>
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
        {isMobile && (
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            {!isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={onEdit}
                  className="flex-1 text-sm"
                >
                  Edit Name
                </Button>
                <Button
                  variant="outline"
                  onClick={onChangePassword}
                  className="flex-1 text-sm"
                >
                  Change Password
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 text-sm bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onSave}
                  loading={loading}
                  className="flex-1 text-sm"
                >
                  Save Changes
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
