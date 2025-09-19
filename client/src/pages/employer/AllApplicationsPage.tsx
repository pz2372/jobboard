import React, { useState, useEffect, useRef } from "react";
import { User, ChevronDown, BriefcaseIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import UserProfileModal from "components/UserProfileModal";
import AppliedApplicationPreviewModal from "components/AppliedApplicationPreviewModal";
import ApplicantCard from "components/ApplicantCard";
import AcceptApplicantModal from "components/AcceptApplicantModal";
import employerLocalStorageService from "services/employerLocalStorageService";
import axiosInstance from "axiosInstance";

interface Application {
  id: number;
  status: string;
  appliedDate: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profile?: {
      profileImage?: string;
      city?: string;
      state?: string;
      bio?: string;
      education?: string[];
      work?: string[];
      extracurriculars?: string[];
      clubs?: string[];
      hobbies?: string[];
      awards?: string[];
      volunteer?: string[];
      instagram?: string;
      tiktok?: string;
      portfolioVideos?: string[];
    };
  };
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    status: string;
    createdAt: string;
  };
}

const AllApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>("all");
  const [isJobDropdownOpen, setIsJobDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<any>(null);
  const [selectedAppliedApplication, setSelectedAppliedApplication] = useState<any>(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [selectedApplicationForAccept, setSelectedApplicationForAccept] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadApplicationsFromStorage();

    // Reload data when window regains focus (in case data was updated in another tab)
    const handleFocus = () => {
      loadApplicationsFromStorage();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsJobDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, activeTab, selectedJobFilter]);

  const loadApplicationsFromStorage = () => {
    setLoading(true);
    try {
      // Get applications from localStorage (populated by EmployerDashboard)
      const storedApplications = employerLocalStorageService.getApplications();
      console.log("Loaded applications from localStorage:", storedApplications.length);
      setApplications(storedApplications || []);
    } catch (error) {
      console.error("Error loading applications from localStorage:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;
    
    // Filter by tab (open/closed)
    if (activeTab === "open") {
      // Open applications: Active job status and Active application status
      filtered = filtered.filter(
        (app) => app.status === "Active" && app.job.status === "Active"
      );
    } else {
      // Closed applications: Either job is closed or application is not active
      filtered = filtered.filter(
        (app) => app.status !== "Active" || app.job.status !== "Active"
      );
    }
    
    // Filter by job
    if (selectedJobFilter !== "all") {
      filtered = filtered.filter(
        (app) => app.job.id.toString() === selectedJobFilter
      );
    }
    
    setFilteredApplications(filtered);
  };

  const getUniqueJobs = () => {
    const jobsMap = new Map();
    applications.forEach(app => {
      if (!jobsMap.has(app.job.id)) {
        jobsMap.set(app.job.id, {
          id: app.job.id,
          title: app.job.title,
          company: app.job.company
        });
      }
    });
    return Array.from(jobsMap.values());
  };

  const handleJobSelect = (jobId: string) => {
    setSelectedJobFilter(jobId);
    setIsJobDropdownOpen(false);
  };

  const handleViewProfile = (applicantUser: any) => {
    setSelectedUserProfile(applicantUser);
    setIsProfileModalOpen(true);
  };

  const handleViewApplication = (application: any) => {
    setSelectedAppliedApplication(application);
  };

  const handleDecline = (application: any) => {
    try {
      // Update the application status to "Declined"
      const updatedApplications = applications.map(app => 
        app.id === application.id 
          ? { ...app, status: "Declined" }
          : app
      );
      
      // Update local state
      setApplications(updatedApplications);
      
      // Update localStorage
      employerLocalStorageService.updateApplications(updatedApplications);
      
      console.log("Application declined successfully:", application);
    } catch (error) {
      console.error("Error declining application:", error);
    }
  };

  const handleAccept = async (application: any) => {
    try {
      console.log("Accepting application:", application.id);
      
      const response = await axiosInstance.put(
        `/employerapplications/${application.id}`,
        {
          status: "Accepted"
        }
      );

      console.log("Accept API response:", response.data);

      // Update the application status in the local state
      // The server will set the acceptedDate automatically
      const updatedApplications = applications.map(app => 
        app.id === application.id 
          ? { 
              ...app, 
              status: "Accepted",
              acceptedDate: response.data.data?.acceptedDate || new Date().toISOString()
            }
          : app
      );
      
      // Update local state
      setApplications(updatedApplications);
      
      // Update localStorage
      employerLocalStorageService.updateApplications(updatedApplications);
      
      // Close the modal
      setIsAcceptModalOpen(false);
      setSelectedApplicationForAccept(null);
      
      console.log("Application accepted successfully:", application);
    } catch (error) {
      console.error("Error accepting application:", error);
      alert("Failed to accept application. Please try again.");
    }
  };

  const handleAcceptClick = (application: any) => {
    setSelectedApplicationForAccept(application);
    setIsAcceptModalOpen(true);
  };

  const handleReopen = (application: any) => {
    try {
      // Update the application status to "Active"
      const updatedApplications = applications.map(app => 
        app.id === application.id 
          ? { ...app, status: "Active" }
          : app
      );
      
      // Update local state
      setApplications(updatedApplications);
      
      // Update localStorage
      employerLocalStorageService.updateApplications(updatedApplications);
      
      console.log("Application reopened successfully:", application);
    } catch (error) {
      console.error("Error reopening application:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-teal-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          </div>

          <div className="flex justify-between md:justify-center items-center mb-6 relative">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("open")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === "open"
                    ? "bg-white text-teal-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Open ({filteredApplications.length > 0 && activeTab === "open" ? filteredApplications.length : applications.filter(app => app.status === "Active" && app.job.status === "Active").length})
              </button>
              <button
                onClick={() => setActiveTab("closed")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === "closed"
                    ? "bg-white text-teal-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Closed ({filteredApplications.length > 0 && activeTab === "closed" ? filteredApplications.length : applications.filter(app => app.status !== "Active" || app.job.status !== "Active").length})
              </button>
            </div>

            {/* Job Filter Dropdown - Positioned absolutely on desktop, inline on mobile */}
            <div className="md:absolute md:right-0" ref={dropdownRef}>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setIsJobDropdownOpen(!isJobDropdownOpen)}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-white text-teal-600 shadow-sm flex items-center gap-2"
                >
                  {selectedJobFilter !== "all" 
                    ? getUniqueJobs().find(job => job.id.toString() === selectedJobFilter)?.title || "All Jobs"
                    : "All Jobs"
                  }
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Dropdown Menu */}
              {isJobDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10 min-w-[200px]">
                  <div className="p-2">
                    <div
                      className="px-4 py-2 hover:bg-teal-50 cursor-pointer rounded-lg transition-colors duration-150"
                      onClick={() => handleJobSelect("all")}
                    >
                      All Jobs
                    </div>
                    {getUniqueJobs().map((job) => (
                      <div
                        key={job.id}
                        className="px-4 py-2 hover:bg-teal-50 cursor-pointer rounded-lg transition-colors duration-150"
                        onClick={() => handleJobSelect(job.id.toString())}
                      >
                        {job.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {activeTab} applications found
                </h3>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <ApplicantCard
                    key={application.id}
                    application={application}
                    onViewApplication={handleViewApplication}
                    onViewProfile={handleViewProfile}
                    onAcceptClick={handleAcceptClick}
                    onDecline={() => handleDecline(application)}
                    onReopen={() => handleReopen(application)}
                    showJobInfo={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedUserProfile(null);
        }}
        user={selectedUserProfile}
      />

      {/* Applied Application Preview Modal */}
      {selectedAppliedApplication && (
        <AppliedApplicationPreviewModal
          isOpen={!!selectedAppliedApplication}
          onClose={() => setSelectedAppliedApplication(null)}
          basicFields={selectedAppliedApplication.application?.basicFields || {}}
          documents={selectedAppliedApplication.application?.documents || {}}
          questions={selectedAppliedApplication.application?.questions || selectedAppliedApplication.application?.question || []}
          basicFieldAnswers={selectedAppliedApplication.basicFieldAnswers || {}}
          questionAnswers={selectedAppliedApplication.questionAnswers || {}}
          applicantName={`${selectedAppliedApplication.user?.firstName} ${selectedAppliedApplication.user?.lastName}`}
        />
      )}

      {/* Accept Applicant Modal */}
      <AcceptApplicantModal
        isOpen={isAcceptModalOpen}
        onClose={() => {
          setIsAcceptModalOpen(false);
          setSelectedApplicationForAccept(null);
        }}
        onConfirm={() => handleAccept(selectedApplicationForAccept)}
        applicantName={selectedApplicationForAccept ? `${selectedApplicationForAccept.user.firstName} ${selectedApplicationForAccept.user.lastName}` : ""}
        jobTitle={selectedApplicationForAccept?.job?.title || ""}
      />
    </div>
  );
};

export default AllApplicationsPage;
