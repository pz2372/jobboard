import React from "react";
import { UserCircle, CalendarIcon, FileTextIcon, XIcon, BriefcaseIcon, RotateCcwIcon, CheckIcon } from "lucide-react";
import { FormatDate } from "./methods/FormatDate";

interface ApplicantCardProps {
  application: {
    id: number;
    status: string;
    appliedDate?: string;
    createdAt?: string;
    user: {
      firstName: string;
      lastName: string;
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
    application?: any; // For checking if application data exists
  };
  onViewApplication?: (application: any) => void;
  onViewProfile: (user: any) => void;
  onAcceptClick?: (application: any) => void; // Changed from onAccept to onAcceptClick
  onDecline?: () => void;
  onReopen?: () => void;
  showJobInfo?: boolean; // Whether to show job title and location
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({
  application,
  onViewApplication,
  onViewProfile,
  onAcceptClick,
  onDecline,
  onReopen,
  showJobInfo = false,
}) => {
  const appliedDate = application.appliedDate || application.createdAt;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <button
          onClick={() => onViewProfile(application.user)}
          className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
        >
          {application.user.profile?.profileImage ? (
            <img
              src={application.user.profile.profileImage}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <UserCircle className="w-12 h-12 text-gray-300" />
          )}
        </button>
        <div className="space-y-1">
          <button
            onClick={() => onViewProfile(application.user)}
            className="font-medium text-gray-900 hover:text-teal-600 transition-colors duration-200 cursor-pointer text-left"
          >
            {application.user.firstName} {application.user.lastName}
          </button>
          
          {application.job && (
            <div className="flex items-center text-sm text-gray-600">
              <BriefcaseIcon className="w-4 h-4 mr-2" />
              {application.job.title}
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Applied on {FormatDate(new Date(appliedDate))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        {application.application && onViewApplication && (
          <button
            onClick={() => onViewApplication(application)}
            className="inline-flex items-center px-4 py-2 text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors duration-200"
          >
            <FileTextIcon className="w-4 h-4 mr-2" />
            View Application
          </button>
        )}
        
        {/* Show Accept button for Active applications */}
        {application.status === "Active" && onAcceptClick && (
          <button
            onClick={() => onAcceptClick(application)}
            className="inline-flex items-center px-4 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
          >
            <CheckIcon className="w-4 h-4 mr-2" />
            Accept
          </button>
        )}
        
        {/* Show Decline button for Active applications, or Reopen button for Declined applications with Active jobs */}
        {((application.status !== "Declined" && onDecline) || 
          (application.status === "Declined" && application.job?.status === "Active" && onReopen)) && (
          <button
            onClick={application.status === "Declined" ? onReopen : onDecline}
            className={`inline-flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
              application.status === "Declined"
                ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                : "text-red-600 hover:text-red-700 hover:bg-red-50"
            }`}
          >
            {application.status === "Declined" ? (
              <>
                <RotateCcwIcon className="w-4 h-4 mr-2" />
                Reopen
              </>
            ) : (
              <>
                <XIcon className="w-4 h-4 mr-2" />
                Decline
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplicantCard;
