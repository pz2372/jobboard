import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import axiosInstance from "axiosInstance";

type DeleteJobModalProps = {
    jobId: number;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
  
  const DeleteJobModal: React.FC<DeleteJobModalProps> = ({ jobId, setIsOpen }) => {
    const handleDeleteJob = () => {
        axiosInstance.delete(`employerjob/${jobId}`)
    }

  return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Delete Job
                </h2>
              </div>

              <p className="mt-4 text-sm text-gray-600">
                Are you sure you want to delete this job? This action cannot be
                undone.
              </p>

              <div className="mt-6 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {handleDeleteJob(); setIsOpen(false)}}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
  );
};

export default DeleteJobModal;
