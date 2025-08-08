import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Input from "../../components/Input";

const ChangePasswordModal = ({
  isOpen,
  onClose,
  passwordData,
  loading,
  onPasswordChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Password
          </label>
          <Input
            type="password"
            name="oldPassword"
            value={passwordData.oldPassword}
            onChange={onPasswordChange}
            placeholder="Enter current password"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            New Password
          </label>
          <Input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={onPasswordChange}
            placeholder="Enter new password (min 6 characters)"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirm New Password
          </label>
          <Input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={onPasswordChange}
            placeholder="Confirm new password"
            required
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="w-full sm:w-auto">
            Change Password
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
