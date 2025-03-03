import React from "react";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Building2,
  Send,
  X,
  CalendarDays,
  Clock,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const JobModal = ({ job, onClose }: { job: any; onClose: () => void }) => {
  const navigate = useNavigate();

  const parsedRequirements: string[] =
  typeof job.requirements === "string"
    ? job.requirements.replace(/[{}]/g, "").split(/",\s*"/).map(req => req.replace(/"/g, ''))
    : [];

  return (
    <div className="fixed z-20 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-teal-600 mb-2">
                {job.title}
              </h2>
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-4 h-4" />
                <Link to={`/company/${job.employerId}`}>
                  <span>{job.company}</span>
                </Link>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-teal-50 text-teal-600 px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 bg-teal-50 text-teal-600 px-4 py-2 rounded-full">
              <DollarSign className="w-4 h-4" />
              <span>
                {job.minWage}-{job.maxWage}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-teal-50 text-teal-600 px-4 py-2 rounded-full">
              <Briefcase className="w-4 h-4" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-2 bg-teal-50 text-teal-600 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4" />
              <span>20-25 hrs/week</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Job Description</h3>
            <p className="text-gray-600 leading-relaxed">{job.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Requirements</h3>
            <ul className="space-y-3">
              {job.requirements &&
                parsedRequirements.map((req, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    <span>{req as string}</span>
                  </li>
                ))}
            </ul>
          </div>

          {/*<div>
            <h3 className="text-lg font-semibold mb-3">Schedule</h3>
            <div className="flex flex-wrap gap-3">
              {job.schedule.map((schedule, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full text-gray-600"
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>{schedule}</span>
                </div>
              ))}
            </div>
          </div>*/}
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={() => navigate(`/jobapplication/${job.id}`)}
            className="w-full bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-500 transition-all duration-300 font-medium flex items-center justify-center gap-2"
          >
            Apply Now
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
