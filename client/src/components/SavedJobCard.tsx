import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import axiosInstance from "axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { FormatDate } from "./methods/FormatDate";
import JobModal from "./JobModal";

type SavedJobCardProps = {
  job: any;
  index: number;
  removeJob: any;
};

const SavedJobCard = ({ job, index, removeJob }: SavedJobCardProps) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);

  const handleDeleteSave = () => {
    axiosInstance
      .delete(`/savedjobs/${user.id}/${job.jobId}`)
      .then((response) => removeJob(job.id))
      .catch((error) => console.error(error));
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!user) {
      navigate("/login");
      return;
    }

    // Debug: Log the job object to see its structure
    console.log("Job object structure:", job);
    console.log("Job.job.employerId:", job.job?.employerId);

    axiosInstance
      .post(`/applications/job/${job.jobId}/apply`, { userId: user.id })
      .then((response) => {
        const application = response.data;

        if (application.needsMoreInfo) {
          navigate("/jobapplication", { state: { application } });
        } else {
          // Application completed successfully
          console.log("Application submitted successfully");
          
          // Remove from saved jobs since it's now applied
          axiosInstance
            .delete(`/savedjobs/${user.id}/${job.jobId}`)
            .then(() => {
              removeJob(job.id); // Remove from UI
              console.log("Job moved from saved to applied");
            })
            .catch((error) => {
              console.error("Error removing from saved jobs:", error);
              // Even if removal fails, the application was successful
            });
        }
      })
      .catch((error) => {
        console.error("Error applying:", error);
        if (error.response?.status === 409) {
          console.log("Already applied for this job");
          // If already applied, also remove from saved jobs
          axiosInstance
            .delete(`/savedjobs/${user.id}/${job.jobId}`)
            .then(() => {
              removeJob(job.id);
              console.log("Job removed from saved (already applied)");
            })
            .catch((deleteError) => {
              console.error("Error removing from saved jobs:", deleteError);
            });
        }
      });
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    handleDeleteSave();
  };

  return (
    <>
      <div
        key={index}
        onClick={handleCardClick}
        className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 cursor-pointer"
      >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-1 text-teal-600">
            {job.job.title}
          </h3>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            <p className="text-gray-600">{job.job.companyName || job.job.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">{FormatDate(job.createdAt)}</span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="text-gray-600 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span>{job.job.city +", "+ job.job.state}</span>
        </div>
        <div className="text-gray-600 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <span>
            {job.job.payRate} / {job.job.payFrequency}
          </span>
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <button
          onClick={handleApplyClick}
          className="flex-1 bg-teal-50 text-teal-600 px-4 py-3 rounded-xl hover:bg-teal-100 transition-all duration-300 font-medium flex items-center justify-center gap-2"
        >
          Apply Now
          <Send className="w-4 h-4" />
        </button>
        <button
          onClick={handleDeleteClick}
          className="px-4 py-3 rounded-xl border border-gray-200 hover:bg-red-50 transition-all duration-300"
        >
          <XIcon className="w-4 h-4 text-red-400" />
        </button>
      </div>
    </div>

    {isModalOpen && (
      <JobModal 
        job={job.job} 
        onClose={() => setIsModalOpen(false)} 
      />
    )}
  </>
  );
};

export default SavedJobCard;
