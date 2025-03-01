import React from "react";
import {
  Search,
  MapPin,
  DollarSign,
  Briefcase,
  ArrowRight,
  Building2,
  Send,
  UserCircle,
  BriefcaseIcon,
  BookmarkIcon,
  CheckCircleIcon,
  ClockIcon,
  XIcon,
  AlertCircleIcon,
} from "lucide-react";
import { FormatDate } from "./methods/FormatDate";

type AppliedJobCardProps = {
    job: any;
    index: number;
    viewApplication: (applicationId: number) => void;
  };

const AppliedJobCard = ({ job, index, viewApplication }: AppliedJobCardProps) => {

  return (
    <div
      key={index}
      className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 border border-gray-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-1 text-teal-600">
            {job.job.title}
          </h3>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            <p className="text-gray-600">{job.job.company}</p>
          </div>
        </div>
        <span
          className={`text-sm px-3 py-1 rounded-full font-medium ${
            job.status === "Under Review"
              ? "bg-blue-50 text-blue-600"
              : job.status === "Interviewing"
              ? "bg-green-50 text-green-600"
              : job.status === "Rejected"
              ? "bg-red-50 text-red-600"
              : "bg-yellow-50 text-yellow-600"
          }`}
        >
          {job.status}
        </span>
      </div>
      <div className="space-y-3">
        <div className="text-gray-600 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span>{job.job.location}</span>
        </div>
        <div className="text-gray-600 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <span>
            {job.job.minWage}-{job.job.maxWage}
          </span>
        </div>
        <div className="text-gray-600 flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-gray-500" />
          <span>Applied {FormatDate(job.createdAt)}</span>
        </div>
      </div>
      <button onClick={()=>viewApplication(job.id)} className="w-full mt-6 bg-gray-50 text-gray-600 px-4 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium flex items-center justify-center gap-2">
        View Application
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AppliedJobCard;
