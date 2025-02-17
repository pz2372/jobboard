import React, {useState} from "react";
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
  const [saveButton, setSaveButton] = useState("Save");
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSaveJob = () => {
    axiosInstance
      .post("/savedjobs/add", { userId: user.id, jobId: job.id })
      .then((response) => {
        setSaveButton("Saved")
      })
      .catch((error) => console.error(error));
  };

  return (
    <div
      key={index}
      className={`bg-white rounded-2xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200`}
    >
      <div onClick={onClick} className="cursor-pointer">
        <div className="flex gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-600 text-white font-bold text-xl`}
          >
            {job.logo}
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
            <span>
              {job.minWage}-{job.maxWage}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => {
            navigate(`/jobapplication/${job.id}`);
          }}
          className="flex-1 bg-teal-50 text-teal-600 px-4 py-3 rounded-xl hover:bg-teal-100 transition-all duration-300 font-medium flex items-center justify-center gap-2"
        >
          Apply Now
          <Send className="w-4 h-4" />
        </button>
        <button
          onClick={handleSaveJob}
          className="px-4 py-3 rounded-xl border-2 border-teal-600 text-teal-600 hover:bg-teal-50 transition-all duration-300 flex items-center justify-center gap-2"
        >
          {saveButton}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
