import React from "react";
import { UserCircle, CalendarIcon, BriefcaseIcon, PhoneIcon, MailIcon, TrashIcon } from "lucide-react";
import { FormatDate } from "./methods/FormatDate";

interface AcceptedApplicantCardProps {
  application: {
    id: number;
    status: string;
    acceptedDate?: string;
    appliedDate?: string;
    createdAt?: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      profile?: {
        profileImage?: string;
      };
    };
    job?: {
      id: number;
      title: string;
      company?: string;
      location: string;
      status: string;
    };
  };
  onViewContact: (user: any) => void;
  onDelete: (application: any) => void;
}

const AcceptedApplicantCard: React.FC<AcceptedApplicantCardProps> = ({
  application,
  onViewContact,
  onDelete,
}) => {
  const acceptedDate = application.acceptedDate || application.createdAt;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0">
          {application.user.profile?.profileImage ? (
            <img
              src={application.user.profile.profileImage}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <UserCircle className="w-12 h-12 text-gray-300" />
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">
              {application.user.firstName} {application.user.lastName}
            </h3>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Accepted
            </span>
          </div>
          
          {application.job && (
            <div className="flex items-center text-sm text-gray-600">
              <BriefcaseIcon className="w-4 h-4 mr-2" />
              {application.job.title}
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Accepted on {FormatDate(new Date(acceptedDate))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <button
          onClick={() => onViewContact(application.user)}
          className="inline-flex items-center px-4 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors duration-200"
        >
          <MailIcon className="w-4 h-4 mr-2" />
          View Contact
        </button>
        
        <button
          onClick={() => onDelete(application)}
          className="inline-flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <TrashIcon className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default AcceptedApplicantCard;
