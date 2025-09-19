import React, { useState } from "react";
import { X } from "lucide-react";

interface InstagramConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (handle: string, followers: number) => void;
}

const InstagramConnectModal: React.FC<InstagramConnectModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [handle, setHandle] = useState("");
  const [followers, setFollowers] = useState("");
  const [errors, setErrors] = useState<{ handle?: string; followers?: string }>({});

  const validateForm = () => {
    const newErrors: { handle?: string; followers?: string } = {};
    
    if (!handle.trim()) {
      newErrors.handle = "Instagram handle is required";
    } else if (!handle.startsWith("@")) {
      newErrors.handle = "Handle must start with @";
    }
    
    if (!followers.trim()) {
      newErrors.followers = "Follower count is required";
    } else if (isNaN(Number(followers)) || Number(followers) < 0) {
      newErrors.followers = "Please enter a valid number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onConnect(handle, Number(followers));
      setHandle("");
      setFollowers("");
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setHandle("");
    setFollowers("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Connect Instagram</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Handle
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@username"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.handle ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.handle && (
              <p className="text-red-500 text-xs mt-1">{errors.handle}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Follower Count
            </label>
            <input
              type="number"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              placeholder="0"
              min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.followers ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.followers && (
              <p className="text-red-500 text-xs mt-1">{errors.followers}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstagramConnectModal;
