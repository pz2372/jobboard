import React from "react";
import { XIcon, RefreshCwIcon } from "lucide-react";

interface RepostModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  onConfirm: () => void;
}

const RepostModal: React.FC<RepostModalProps> = ({
  isOpen,
  onClose,
  job,
  onConfirm,
}) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Repost Job</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">{job.title}</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Type:</span> {job.type}</p>
              <p><span className="font-medium">Location:</span> {job.city}, {job.state}</p>
              <p><span className="font-medium">Pay Rate:</span> ${job.payRate}</p>
              <p><span className="font-medium">Pay Frequency:</span> {job.payFrequency}</p>
              <p><span className="font-medium">Current Status:</span> 
                <span className="ml-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-600">
                  {job.status}
                </span>
              </p>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
            This will reactivate the job posting and make it visible to job seekers again. 
            The job will be marked as "Active" and will appear in the active jobs list.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCwIcon className="w-4 h-4" />
            Repost Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepostModal;
