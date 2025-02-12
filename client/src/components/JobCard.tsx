import React from "react";
import {
  Search,
  MapPin,
  DollarSign,
  Briefcase,
  ArrowRight,
  Sparkles,
  Building2,
  Send,
  UserCircle,
  BriefcaseIcon,
  Rocket,
  Star,
  SlidersHorizontal,
  X,
  Lock,
  Users,
  MessageCircle,
  Network,
  Globe2,
} from "lucide-react";

interface JobCardProps {
    job: any;
    index: number;
    onClick: ()=>void;
  }

const JobCard = ({ job, index, onClick }: JobCardProps) => {
  return (
    <div
      key={index}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 ${
        index >= 4 ? "opacity-50 blur-sm pointer-events-none" : ""
      }`}
    >
      <div className="flex gap-4 mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-600 text-white font-bold text-xl`}
        >
          {job.logoLetter}
        </div>
        <div className="flex-1 flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg mb-1 text-teal-600">
              {job.title}
            </h3>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-500" />
              <p className="text-gray-600">{job.company}</p>
            </div>
          </div>
          <span className="bg-teal-50 text-teal-600 text-sm px-4 py-1.5 rounded-full font-medium flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            {job.type}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="text-gray-600 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span>{job.location}</span>
        </div>
        <div className="text-gray-600 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <span>{job.salary}</span>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button className="flex-1 bg-teal-50 text-teal-600 px-4 py-3 rounded-xl hover:bg-teal-100 transition-all duration-300 font-medium flex items-center justify-center gap-2">
          Apply Now
          <Send className="w-4 h-4" />
        </button>
        <button className="px-4 py-3 rounded-xl border-2 border-teal-600 text-teal-600 hover:bg-teal-50 transition-all duration-300 flex items-center justify-center gap-2">
         Save
        </button>
      </div>
    </div>
  );
};

export default JobCard;
