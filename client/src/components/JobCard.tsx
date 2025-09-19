import React, { useState } from "react";
import { DollarSign, Building2, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "axiosInstance";
import { RootState } from "redux/store";
import { useSelector } from "react-redux";

interface JobCardProps {
  job: any;
  index: number;
  onClick: () => void;
}

const JobCard = ({ job, index, onClick }: JobCardProps) => {
  const [applyButton, setApplyButton] = useState("Apply Now");
  const [saveButton, setSaveButton] = useState("Save");
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  // Helper function to get company name with fallback
  const getCompanyName = () => job.companyName || job.company || "";

  const handleApplyJob = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the onClick from bubbling up to parent elements

    if (!user) {
      navigate("/login");
      return;
    }

    axiosInstance
      .post(`/applications/job/${job.id}/apply`, { userId: user.id })
      .then((response) => {
        const application = response.data;

        if (application.needsMoreInfo) {
          navigate("/jobapplication", { state: { application } });
        } else {
          setApplyButton("Applied");
          setIsApplied(true);
        }
      })
      .catch((error) => {
        console.error("Error applying:", error);
      });
  };

  const handleSaveJob = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the onClick from bubbling up to parent elements

    if (!user) {
      navigate("/login");
      return;
    }

    if (isSaved) {
      // Unsave the job
      axiosInstance
        .delete(`/savedjobs/${user.id}/${job.id}`)
        .then((response) => {
          setSaveButton("Save");
          setIsSaved(false);
        })
        .catch((error) => console.error("Error unsaving job:", error));
    } else {
      // Save the job
      axiosInstance
        .post("/savedjobs/add", { userId: user.id, jobId: job.id })
        .then((response) => {
          setSaveButton("Saved");
          setIsSaved(true);
        })
        .catch((error) => console.error("Error saving job:", error));
    }
  };

  return (
    <div
      key={index}
      className="relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col mb-20 cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden rounded-[32px] flex-shrink-0">
        {job.logo ? (
          <img
            src={job.logo}
            onClick={onClick}
            alt="Company logo"
            className="w-full aspect-[4/3] object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div
            onClick={onClick}
            className="w-full aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-600 text-white font-bold text-lg sm:text-xl transition-transform duration-500 hover:scale-105"
          >
            {getCompanyName()?.[0] || ""}
          </div>
        )}
        {/*job.industry &&
        <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-orange-100 text-orange-600 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1 rounded-full font-medium">
          {job.industry} 
        </span>
        */}
      </div>

      {/* Text Overlay */}
      <div
        onClick={onClick}
        className="absolute bottom-0 inset-x-4 transform translate-y-1/2 cursor-pointer"
      >
        <div
          className="bg-gradient-to-b from-white via-white to-white/90 rounded-[20px] sm:rounded-[24px] p-3 sm:p-4 
          border border-slate-200/80
          shadow-[0_2px_8px_-2px_rgba(148,163,184,0.3),inset_0_1px_1px_rgba(255,255,255,1)]
          hover:shadow-[0_4px_12px_-2px_rgba(148,163,184,0.4),inset_0_1px_2px_rgba(255,255,255,1)]
          transition-all duration-200"
        >
          <div className="flex flex-col gap-2 sm:gap-3">
            <h3 className="text-lg sm:text-base font-semibold text-emerald-900 line-clamp-1">
              {job.title}
            </h3>
            <div className="grid gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500">
                <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                <span className="text-xs line-clamp-1">{getCompanyName()}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
           
                <span className="font-bold text-emerald-600">
                  <span className="text-lg">${job.payRate}</span><span className="text-xs"> / {job.payFrequency}</span> 
                </span>
              </div>
              <div className="flex items-center gap-1">
                {/* Save Button */}
                <button
                  onClick={handleSaveJob}
                  className={`flex items-center justify-center w-7 h-7 sm:w-7 sm:h-7 rounded-full text-xs font-medium transition-all duration-200
                    ${
                      isSaved
                        ? "bg-yellow-500 text-white hover:bg-yellow-600"
                        : "bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600"
                    }
                    border border-gray-200
                    shadow-[0_2px_4px_-1px_rgba(0,0,0,0.1)]
                    hover:shadow-[0_4px_8px_-1px_rgba(0,0,0,0.15)]`}
                  title={isSaved ? "Unsave Job" : "Save Job"}
                >
                  <Bookmark
                    className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                  />
                </button>

                {/* Apply Button */}
                <button
                  onClick={handleApplyJob}
                  className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium
                    ${
                      isApplied
                        ? "bg-teal-500 text-white"
                        : "bg-teal-600 text-white hover:bg-teal-500"
                    }
                  border border-emerald-900/10
                  shadow-[0_2px_8px_-2px_rgba(6,78,59,0.3)]
                  hover:shadow-[0_4px_12px_-2px_rgba(6,78,59,0.4)]
                  transition-all duration-200`}
                  disabled={isApplied}
                >
                  {applyButton}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*<div className="absolute inset-0 flex items-end justify-center">
        <div className="bg-white bg-opacity-80 p-5 rounded-xl shadow-md w-11/12 max-w-md mb-4">
          <div onClick={onClick} className="flex items-center gap-4 mt-2">
            {job.logo ? (
              <img
                src={job.logo}
                alt="Company logo"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <img
                src="/default-logo.png" // Replace with the actual path to the default logo
                alt="Default logo"
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="font-semibold text-xl text-gray-800">{job.title}</h3>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span>{getCompanyName()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span className="text-blue-600 font-bold">
                  {job.payRate} {job.payFrequency}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSaveJob}
              className={`w-1/2 px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isApplied 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : isSaved
                  ? "bg-gray-200 text-gray-800 cursor-not-allowed"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              disabled={isApplied || isSaved}
            >
              {saveButton}
            </button>
            <button
              onClick={handleApplyJob}
              className={`w-1/2 px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isApplied 
                  ? "bg-teal-500 text-white" 
                  : "bg-teal-600 text-white hover:bg-teal-500"
              }`}
              disabled={isApplied}
            >
              {applyButton}
            </button>
          </div>
        </div>
      </div>*/}
    </div>
  );
};

export default JobCard;
