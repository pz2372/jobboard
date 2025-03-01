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
import AppliedApplicationPreviewModal from "components/AppliedApplicationPreviewModal";

interface SavedJob {
  id: number;
  title: string;
  company: string;
  location: string;
  minWage: number;
  maxWage: number;
  savedDate: string;
  createdAt: string;
}

interface AppliedJob {
  id: number;
  title: string;
  company: string;
  location: string;
  minWage: number;
  maxWage: number;
  appliedDate: string;
  status: string;
  createdAt: string;
}

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState("saved");
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [appliedJobData, setAppliedJobData] = useState<{
    application: any;
    basicFieldAnswers: any;
    questionAnswers: any;
  } | null>(null);
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

  const removeSavedJob = (id: number) => {
    setSavedJobs((prevJobs) => {
      const updatedJobs = prevJobs.filter((job) => job.id !== id);
      return updatedJobs;
    });
  };

  const handleViewApplication = (applicationId: number) => {
    axiosInstance
      .get(`/applications/getUserApplicationById/${applicationId}`)
      .then((response) => {
        setAppliedJobData(response.data.data);
        setShowPreview(true);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
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

      {appliedJobData && (
        <AppliedApplicationPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          basicFields={appliedJobData.application.basicFields}
          documents={appliedJobData.application.documents}
          questions={appliedJobData.application.questions}
          basicFieldAnswers={appliedJobData.basicFieldAnswers}
          questionAnswers={appliedJobData.questionAnswers}
        />
      )}

{activeTab === "saved" && (
  <div className="space-y-4">
    {savedJobs
      .slice() // Make a copy to avoid mutating state
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Sort newest first
      .map((job, index) => (
        <SavedJobCard
          job={job}
          index={index}
          key={index}
          removeJob={removeSavedJob}
        />
      ))}
  </div>
)}

{activeTab === "applied" && (
  <div className="space-y-4">
    {appliedJobs
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((job, index) => (
        <AppliedJobCard
          job={job}
          index={index}
          key={index}
          viewApplication={handleViewApplication}
        />
      ))}
  </div>
)}
    </div>
  );
};

export default HistoryPage;
