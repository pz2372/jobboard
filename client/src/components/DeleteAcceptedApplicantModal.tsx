import React from "react";
import { XIcon, AlertTriangleIcon, TrashIcon } from "lucide-react";

interface DeleteAcceptedApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  applicantName: string;
  jobTitle: string;
}

const DeleteAcceptedApplicantModal: React.FC<DeleteAcceptedApplicantModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  applicantName,
  jobTitle,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Delete Accepted Applicant
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangleIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900 mb-2">
                This action cannot be undone.
              </p>
              <p>
                Deleting <span className="font-medium">{applicantName}</span> for{" "}
                <span className="font-medium">"{jobTitle}"</span> will permanently remove them from your dashboard. You will lose access to their contact information.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAcceptedApplicantModal;
