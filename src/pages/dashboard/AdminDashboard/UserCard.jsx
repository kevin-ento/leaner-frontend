import Button from "../../../components/Button";
import { getRoleDisplayName } from "../../../utils/getRoleDisplayName";

const UserCard = ({
  users,
  editingUser,
  setEditingUser,
  handleUpdateUserRole,
  handleDeleteClick,
}) => {
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "instructor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "student":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {users.map((user) => {
        const userId = user._id || user.id;
        return (
          <div
            key={userId}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mb-4">
              {editingUser === userId ? (
                <select
                  defaultValue={user.role}
                  onChange={(e) => handleUpdateUserRole(userId, e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Administrator</option>
                </select>
              ) : (
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(
                    user.role
                  )}`}
                >
                  {getRoleDisplayName(user.role)}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {editingUser === userId ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 text-xs"
                >
                  Cancel
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingUser(userId)}
                  className="flex-1 text-xs bg-transparent"
                >
                  Edit Role
                </Button>
              )}
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDeleteClick(user)}
                className="flex-1 text-xs"
              >
                Delete
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserCard;
