import React from "react";
import { XIcon, MailIcon, PhoneIcon, UserIcon } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    profile?: {
      profileImage?: string;
    };
  };
}

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

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
            Contact Information
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0">
            {user.profile?.profileImage ? (
              <img
                src={user.profile.profileImage}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <UserIcon className="w-16 h-16 text-gray-300 p-2" />
            )}
          </div>
          <div>
            <h4 className="text-xl font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </h4>
            <p className="text-gray-600">Accepted Applicant</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <MailIcon className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(user.email)}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              Copy
            </button>
          </div>

          {user.phone && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{user.phone}</p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(user.phone)}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
