import React, { useState, useEffect } from "react";
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
import axiosInstance from "axiosInstance";
import { RootState } from "redux/store";
import { useSelector } from "react-redux";
import SavedJobCard from "../components/SavedJobCard";
import AppliedJobCard from "components/AppliedJobCard";

interface SavedJob {
  title: string;
  company: string;
  location: string;
  minWage: number;
  maxWage: number;
  savedDate: string;
}

interface AppliedJob {
  title: string;
  company: string;
  location: string;
  minWage: number;
  maxWage: number;
  appliedDate: string;
  status: string;
}

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState("saved");
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    axiosInstance
      .get(`/savedjobs/${user.id}`)
      .then((response) => {
        setSavedJobs(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axiosInstance
      .get(`/applications/user/${user.id}`)
      .then((response) => {
        setAppliedJobs(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user.id]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-teal-600 font-comic tracking-wide">
          Your Job History
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Track your saved and applied positions
        </p>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === "saved"
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <BookmarkIcon className="w-5 h-5" />
            Saved Jobs
            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">
              {savedJobs.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("applied")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === "applied"
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <CheckCircleIcon className="w-5 h-5" />
            Applied Jobs
            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">
              {appliedJobs.length}
            </span>
          </button>
        </div>
      </div>

      {activeTab === "saved" && (
        <div className="space-y-4">
          {savedJobs.map((job, index) => (
            <SavedJobCard job={job} index={index} key={index}/>
          ))}
        </div>
      )}

      {activeTab === "applied" && (
        <div className="space-y-4">
          {appliedJobs.map((job, index) => (
            <AppliedJobCard job={job} index={index} key={index}/>
          ))}
        </div>
      )}
    </main>
  );
};

export default HistoryPage;
