import Modal from "../../../components/Modal";
import Button from "../../../components/Button";

const DeleteUserModal = ({ isOpen, onClose, userToDelete, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete User">
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Are you sure you want to delete user "{userToDelete?.name}"? This
          action cannot be undone.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button variant="danger" onClick={onConfirm} className="flex-1">
          Delete User
        </Button>
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteUserModal;
