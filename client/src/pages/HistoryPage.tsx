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

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState("saved");

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
              3
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
              4
            </span>
          </button>
        </div>
      </div>

      {activeTab === "saved" && (
        <div className="space-y-4">
          {[
            {
              title: "Junior Web Developer",
              company: "Tech Solutions Inc",
              location: "Remote",
              salary: "$60-75k/year",
              savedDate: "2 days ago",
            },
            {
              title: "UX Designer",
              company: "Creative Studio",
              location: "New York, NY",
              salary: "$70-85k/year",
              savedDate: "1 week ago",
            },
            {
              title: "Product Manager",
              company: "Startup Hub",
              location: "San Francisco, CA",
              salary: "$90-110k/year",
              savedDate: "2 weeks ago",
            },
          ].map((job, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-teal-600">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{job.savedDate}</span>
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
              <div className="flex gap-2 mt-6">
                <button className="flex-1 bg-teal-50 text-teal-600 px-4 py-3 rounded-xl hover:bg-teal-100 transition-all duration-300 font-medium flex items-center justify-center gap-2">
                  Apply Now
                  <Send className="w-4 h-4" />
                </button>
                <button className="px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300">
                  <XIcon className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "applied" && (
        <div className="space-y-4">
          {[
            {
              title: "Frontend Developer",
              company: "Web Corp",
              location: "Austin, TX",
              salary: "$65-80k/year",
              status: "Under Review",
              appliedDate: "1 day ago",
            },
            {
              title: "Software Engineer",
              company: "Tech Giants",
              location: "Seattle, WA",
              salary: "$85-100k/year",
              status: "Interviewing",
              appliedDate: "3 days ago",
            },
            {
              title: "UI Developer",
              company: "Design Lab",
              location: "Los Angeles, CA",
              salary: "$70-90k/year",
              status: "Rejected",
              appliedDate: "1 week ago",
            },
            {
              title: "Full Stack Developer",
              company: "Startup X",
              location: "Miami, FL",
              salary: "$75-95k/year",
              status: "Pending",
              appliedDate: "2 weeks ago",
            },
          ].map((job, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-teal-600">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-600">{job.company}</p>
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
                  <span>{job.location}</span>
                </div>
                <div className="text-gray-600 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span>{job.salary}</span>
                </div>
                <div className="text-gray-600 flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-gray-500" />
                  <span>Applied {job.appliedDate}</span>
                </div>
              </div>
              <button className="w-full mt-6 bg-gray-50 text-gray-600 px-4 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium flex items-center justify-center gap-2">
                View Application
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default HistoryPage;
