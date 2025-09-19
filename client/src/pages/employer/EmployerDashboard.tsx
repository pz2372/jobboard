import React, { useEffect, useState, useCallback } from "react";
import {
  PlusIcon,
  TrashIcon,
  UsersIcon,
  BriefcaseIcon,
  MailIcon,
  PhoneIcon,
  EditIcon,
  RefreshCwIcon,
} from "lucide-react";
import axiosInstance from "axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "redux/store";
import { useNavigate } from "react-router-dom";
import { FormatDate } from "components/methods/FormatDate";
import DeleteJobModal from "components/DeleteJobModal";
import UserProfileModal from "components/UserProfileModal";
import AppliedApplicationPreviewModal from "components/AppliedApplicationPreviewModal";
import ApplicantCard from "components/ApplicantCard";
import AcceptedApplicantCard from "components/AcceptedApplicantCard";
import ContactModal from "components/ContactModal";
import DeleteAcceptedApplicantModal from "components/DeleteAcceptedApplicantModal";
import JobModal from "components/JobModal";
import EditJobModal from "components/EditJobModal";
import RepostModal from "components/RepostModal";
import SubscriptionRestrictionsModal from "components/SubscriptionRestrictionsModal";
import AcceptApplicantModal from "components/AcceptApplicantModal";
import subscriptionService, {
  SubscriptionData,
} from "services/subscriptionService";
import useSubscription from "hooks/useSubscription";
import { setEmployer, checkEmployerAuth } from "../../redux/employerAuthSlice";
import employerLocalStorageService from "../../services/employerLocalStorageService";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const employer = useSelector(
    (state: RootState) => state.employerAuth.employer
  );
  
  // Use Redux subscription hook instead of local state
  const { 
    subscription, 
    loading: subscriptionLoading, 
    hasSubscription,
    isActive: subscriptionIsActive,
    planType,
    planName,
    features: subscriptionFeatures,
    limitations: subscriptionLimitations
  } = useSubscription();
  const dispatch = useDispatch<AppDispatch>();
  const [isDeleteJobModalOpen, setIsDeleteJobModalOpen] = useState(false);
  const [selectedAppliedApplication, setSelectedAppliedApplication] =
    useState(null);
  const [selectedJobId, setSelectedJobId] = useState<number>(0);
  const [selectedJobForDelete, setSelectedJobForDelete] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedEditJob, setSelectedEditJob] = useState(null);
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);
  const [selectedRepostJob, setSelectedRepostJob] = useState(null);
  const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [selectedApplicationForAccept, setSelectedApplicationForAccept] = useState<any>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedContactUser, setSelectedContactUser] = useState<any>(null);
  const [isDeleteAcceptedModalOpen, setIsDeleteAcceptedModalOpen] = useState(false);
  const [selectedAcceptedForDelete, setSelectedAcceptedForDelete] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<"Active" | "Closed">(
    "Active"
  );
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState<any>(null);
  const navigate = useNavigate();

  // Define fetchEmployerData function with useCallback to prevent re-renders
  const fetchEmployerData = useCallback(async () => {
    if (!employer?.id) return;

    try {
      console.log("Fetching data from server for employer:", employer.id);

      // Fetch jobs
      const jobsResponse = await axiosInstance.get(
        `/employerjobs/jobs/${employer.id}`
      );
      const jobsData = jobsResponse.data;
      setJobs(jobsData);
      employerLocalStorageService.updateJobs(jobsData);
      console.log("Jobs saved to localStorage:", jobsData.length, "jobs");

      // Fetch applications
      const applicationsResponse = await axiosInstance.get(
        `/employerapplications/employerAppliedApplications/${employer.id}`
      );
      const applicationsData = applicationsResponse.data;
      setApplications(applicationsData);
      employerLocalStorageService.updateApplications(applicationsData);
      console.log(
        "Applications saved to localStorage:",
        applicationsData.length,
        "applications"
      );

      setDataLoaded(true);
      console.log(
        "Fresh data fetched. Jobs/applications saved to localStorage"
      );
    } catch (error) {
      console.error("Error fetching employer data:", error);
      if (error.status === 401) {
        // Authentication failed - redirect to login
        navigate("/employer/login");
      }
    }
  }, [employer?.id, navigate]);

  // Get current plan details from subscription or fall back to default
  const planDetails = (subscription?.status === 'active' && subscription?.planDetails) ? subscription.planDetails : {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    features: ["Browse job board", "View company profiles"],
  };

  // Job posting limits based on subscription plan
  const getJobPostingLimits = () => {
    if (!subscription || subscription.status !== 'active') {
      return { max: 0, plan: 'free' };
    }

    const planTypeStr = subscription.planType.toLowerCase();
    switch (planTypeStr) {
      case 'basic':
        return { max: 1, plan: 'basic' };
      case 'impact':
        return { max: 2, plan: 'impact' };
      case 'accelerate':
        return { max: 3, plan: 'accelerate' };
      case 'corporate':
        return { max: 8, plan: 'corporate' };
      default:
        return { max: 0, plan: 'free' };
    }
  };

  // Count active jobs
  const getActiveJobCount = () => {
    return jobs.filter(job => job.status === 'Active').length;
  };

  // Check if user can create a new job
  const canCreateNewJob = () => {
    const limits = getJobPostingLimits();
    const activeCount = getActiveJobCount();
    return activeCount < limits.max;
  };

  // Handle create job button click with subscription check
  const handleCreateJobClick = () => {
    // Temporarily removed subscription restrictions for testing
    navigate("/employer/createjob");
    
    /* Original subscription check code (commented out temporarily):
    const limits = getJobPostingLimits();
    const activeCount = getActiveJobCount();
    const isFreePlan = !subscription || subscription.status !== 'active';

    if (isFreePlan || activeCount >= limits.max) {
      setIsSubscriptionModalOpen(true);
    } else {
      navigate("/employer/createjob");
    }
    */
  };

  // Load initial data from localStorage
  useEffect(() => {
    // Note: localStorage test removed - now only storing non-sensitive operational data

    if (!employer?.id) {
      console.log("No employer found in Redux state");
      return;
    }

    // First, try to load cached data from localStorage (jobs and applications only)
    const localData = employerLocalStorageService.getEmployerData();
    const hasValidData = employerLocalStorageService.hasValidData();

    if (hasValidData) {
      console.log("Loading cached operational data from localStorage");
      setJobs(localData.jobs || []);
      setApplications(localData.applications || []);
      // Note: Subscription data is not cached, will be fetched fresh
      setDataLoaded(true);

      // Data is fresh enough, don't fetch from server immediately
      if (employerLocalStorageService.getDataAge() < 1) {
        // Less than 1 hour old
        console.log("Using fresh cached data");
        return;
      }
    }

    console.log("Fetching fresh data for employer:", employer.id);
    fetchEmployerData();
  }, [employer?.id, navigate, fetchEmployerData]);

  const handleDeleteJob = (jobId: number) => {
    console.log("Attempting to delete job with ID:", jobId);
    axiosInstance
      .delete(`employerjobs/${jobId}`)
      .then((response) => {
        console.log("Delete API response:", response.data);
        // Update the job status to "Closed" instead of removing it from the array
        const updatedJobs = jobs.map((job) =>
          job.id === jobId ? { ...job, status: "Closed" } : job
        );
        setJobs(updatedJobs);
        // Update localStorage with the updated jobs
        employerLocalStorageService.updateJobs(updatedJobs);
        console.log("Job moved to Closed status locally");

        // Fetch fresh data from server to confirm the update
        setTimeout(() => {
          fetchEmployerData();
          console.log("Fetched fresh data after delete");
        }, 500);
      })
      .catch((error) => {
        console.error("Error deleting job:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        alert("Failed to delete job. Please try again.");
      });
  };

  const handleViewProfile = (applicantUser) => {
    setSelectedUserId(applicantUser.id);
    setSelectedUserProfile(applicantUser);
    setIsProfileModalOpen(true);
  };

  const handleJobTitleClick = (job) => {
    // Format the job data to match what JobModal expects
    const formattedJob = {
      ...job,
      location: `${job.city}, ${job.state}`,
      company: job.companyName, // Keep for backward compatibility
      companyName: job.companyName, // Ensure new field is available
      minWage: job.payRate,
      maxWage: job.payRate,
    };
    setSelectedJob(formattedJob);
    setIsJobModalOpen(true);
  };

  const handleEditJob = (job) => {
    setSelectedEditJob(job);
    setIsEditJobModalOpen(true);
  };

  const handleRepostJob = (job) => {
    setSelectedRepostJob(job);
    setIsRepostModalOpen(true);
  };

  const confirmRepostJob = async () => {
    if (!selectedRepostJob) return;

    try {
      console.log(
        "🔄 Attempting to repost job:",
        selectedRepostJob.id,
        "from status:",
        selectedRepostJob.status
      );

      const response = await axiosInstance.put(
        `/employerjobs/${selectedRepostJob.id}`,
        {
          status: "Active",
        }
      );

      console.log("✅ Repost API response:", response.data);

      // Use the updated job from the server response if available
      const updatedJobFromServer = response.data.job;

      // Update the job status in the local state
      const updatedJobs = jobs.map((job) =>
        job.id === selectedRepostJob.id
          ? updatedJobFromServer || { ...job, status: "Active" }
          : job
      );
      setJobs(updatedJobs);

      // Update localStorage
      employerLocalStorageService.updateJobs(updatedJobs);
      console.log("📱 Local state and localStorage updated");

      // Show success message (you can add a toast notification here if you have one)
      console.log("🎉 Job successfully reposted!");

      setIsRepostModalOpen(false);
      setSelectedRepostJob(null);
    } catch (error) {
      console.error("❌ Error reposting job:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          method: error.config?.method,
          url: error.config?.url,
          data: error.config?.data,
        },
      });

      // Show error message to user (you can add a toast notification here)
      alert(
        `Failed to repost job: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleJobUpdated = (updatedJob) => {
    // Update the jobs list with the updated job
    const updatedJobs = jobs.map((job) =>
      job.id === updatedJob.id ? updatedJob : job
    );
    setJobs(updatedJobs);

    // Update localStorage
    employerLocalStorageService.updateJobs(updatedJobs);
  };

  const handleDecline = async (application) => {
    try {
      console.log("Declining application:", application.id);
      
      const response = await axiosInstance.put(
        `/employerapplications/${application.id}`,
        {
          status: "Declined"
        }
      );

      console.log("Decline API response:", response.data);

      // Update the application status in the local state
      const updatedApplications = applications.map((app) =>
        app.id === application.id ? { ...app, status: "Declined" } : app
      );
      setApplications(updatedApplications);

      // Update localStorage
      employerLocalStorageService.updateApplications(updatedApplications);
      console.log("Application declined successfully");

      // Optionally show success message
      // You can add a toast notification here if you have one
      
    } catch (error) {
      console.error("Error declining application:", error);
      alert("Failed to decline application. Please try again.");
    }
  };

  const handleAccept = async (application) => {
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
      const updatedApplications = applications.map((app) =>
        app.id === application.id ? { 
          ...app, 
          status: "Accepted",
          acceptedDate: response.data.data?.acceptedDate || new Date().toISOString()
        } : app
      );
      setApplications(updatedApplications);

      // Update localStorage
      employerLocalStorageService.updateApplications(updatedApplications);
      console.log("Application accepted successfully");

      // Close the modal
      setIsAcceptModalOpen(false);
      setSelectedApplicationForAccept(null);

      // Optionally show success message
      // You can add a toast notification here if you have one
      
    } catch (error) {
      console.error("Error accepting application:", error);
      alert("Failed to accept application. Please try again.");
    }
  };

  const handleAcceptClick = (application) => {
    setSelectedApplicationForAccept(application);
    setIsAcceptModalOpen(true);
  };

  // Filter accepted applicants within 30 days
  const getRecentAcceptedApplicants = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return applications.filter(applicant => {
      if (applicant.status !== "Accepted") return false;
      
      const acceptedDate = new Date(applicant.acceptedDate || applicant.createdAt);
      return acceptedDate >= thirtyDaysAgo;
    }).slice(0, 5); // Limit to 5 accepted applicants
  };

  const handleViewContact = (user) => {
    setSelectedContactUser(user);
    setIsContactModalOpen(true);
  };

  const handleDeleteAcceptedApplicant = async (application) => {
    setSelectedAcceptedForDelete(application);
    setIsDeleteAcceptedModalOpen(true);
  };

  const confirmDeleteAcceptedApplicant = async () => {
    if (!selectedAcceptedForDelete) return;
    
    try {
      console.log("Deleting accepted application:", selectedAcceptedForDelete.id);
      
      const response = await axiosInstance.delete(
        `/employerapplications/${selectedAcceptedForDelete.id}`
      );

      console.log("Delete accepted application response:", response.data);

      // Remove the application from local state
      const updatedApplications = applications.filter((app) =>
        app.id !== selectedAcceptedForDelete.id
      );
      setApplications(updatedApplications);

      // Update localStorage
      employerLocalStorageService.updateApplications(updatedApplications);
      console.log("Accepted application deleted successfully");

      // Close modal and reset state
      setIsDeleteAcceptedModalOpen(false);
      setSelectedAcceptedForDelete(null);

    } catch (error) {
      console.error("Error deleting accepted application:", error);
      alert("Failed to delete accepted application. Please try again.");
    }
  };

  console.log("Debug subscription data:", {
    subscription,
    subscriptionStatus: subscription?.status,
    hasSubscription,
    subscriptionIsActive,
    planDetails,
    subscriptionLoading
  });

  console.log(applications)

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 py-8 rounded-3xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center ml-5 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {employer?.companyName || "Employer"} Dashboard
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreateJobClick}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-500 transition-all duration-300 flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5 hidden sm:block" />
              Create New Listing
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveFilter("Active")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeFilter === "Active"
                    ? "bg-white text-teal-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveFilter("Closed")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeFilter === "Closed"
                    ? "bg-white text-teal-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Closed
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">
                    Position
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">
                    Applications
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">
                    Posted Date
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {jobs
                  .filter((job) => {
                    if (activeFilter === "Active") {
                      return job.status !== "Delete" && job.status !== "Closed";
                    } else {
                      return job.status === "Delete" || job.status === "Closed";
                    }
                  })
                  .map((job) => {
                    return (
                      <tr
                        key={job.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <BriefcaseIcon className="w-5 h-5 text-teal-600" />
                            <div>
                              <button
                                onClick={() => handleJobTitleClick(job)}
                                className="font-medium text-gray-900 hover:text-teal-600 transition-colors duration-200 text-left"
                              >
                                {job.title}
                              </button>
                              <p className="text-sm text-gray-500">
                                {job.type}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <UsersIcon className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600">
                              {job.applicantCount} applicants
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {FormatDate(new Date(job.createdAt))}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              job.status === "Active"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-end gap-2">
                            {job.status === "Active" ? (
                              <>
                                <button
                                  onClick={() => handleEditJob(job)}
                                  className="p-2 text-gray-400 hover:text-teal-500 transition-colors"
                                  title="Edit Job"
                                >
                                  <EditIcon className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedJobId(job.id);
                                    setSelectedJobForDelete(job);
                                    setIsDeleteJobModalOpen(true);
                                  }}
                                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                  title="Delete Job"
                                >
                                  <TrashIcon className="w-5 h-5" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleRepostJob(job)}
                                className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                                title="Repost Job"
                              >
                                <RefreshCwIcon className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {jobs.length === 0 && (
            <div className="text-center pt-5">No Job Postings</div>
          )}
        </div>

      {isDeleteJobModalOpen && selectedJobForDelete && (
        <DeleteJobModal
          job={selectedJobForDelete}
          setIsOpen={setIsDeleteJobModalOpen}
          handleDeleteJob={handleDeleteJob}
        />
      )}        {selectedAppliedApplication && (
          <AppliedApplicationPreviewModal
            isOpen={selectedAppliedApplication}
            onClose={() => setSelectedAppliedApplication(null)}
            basicFields={selectedAppliedApplication.application?.basicFields || {}}
            documents={selectedAppliedApplication.application?.documents || {}}
            questions={selectedAppliedApplication.application?.questions || selectedAppliedApplication.application?.question || []}
            basicFieldAnswers={selectedAppliedApplication.basicFieldAnswers || {}}
            questionAnswers={selectedAppliedApplication.questionAnswers || {}}
            applicantName={`${selectedAppliedApplication.user?.firstName} ${selectedAppliedApplication.user?.lastName}`}
          />
        )}

        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => {
            setIsProfileModalOpen(false);
            setSelectedUserId(null);
            setSelectedUserProfile(null);
          }}
          user={selectedUserProfile}
        />

        {isJobModalOpen && selectedJob && (
          <JobModal
            job={selectedJob}
            onClose={() => {
              setIsJobModalOpen(false);
              setSelectedJob(null);
            }}
          />
        )}

        {isEditJobModalOpen && selectedEditJob && (
          <EditJobModal
            job={selectedEditJob}
            isOpen={isEditJobModalOpen}
            onClose={() => {
              setIsEditJobModalOpen(false);
              setSelectedEditJob(null);
            }}
            onJobUpdated={handleJobUpdated}
          />
        )}

        {/* Accepted Applicants Section */}
        {getRecentAcceptedApplicants().length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Accepted Applicants
              </h2>
              <p className="text-sm text-gray-500">
                Showing contacts for 30 days
              </p>
            </div>
            <div className="space-y-4">
              {getRecentAcceptedApplicants().map((applicant, index) => (
                <AcceptedApplicantCard
                  key={index}
                  application={applicant}
                  onViewContact={handleViewContact}
                  onDelete={handleDeleteAcceptedApplicant}
                />
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Applicants
            </h2>
            <button
              onClick={() => navigate("/employer/applications")}
              className="text-teal-600 hover:text-teal-700 font-medium text-sm hover:underline transition-colors"
            >
              View All Applications
            </button>
          </div>
          {applications.length === 0 ? (
            <div className="text-center">No Recent Applicants</div>
          ) : (
            <div className="space-y-4">
              {applications
                .filter(applicant => 
                  applicant.status === "Active" && applicant.job.status === "Active"
                )
                .slice(0, 8) // Limit to 8 applications
                .map((applicant, index) => {
                  console.log(applicant)

                  return (
                    <ApplicantCard
                      key={index}
                      application={applicant}
                      onViewApplication={applicant.application ? () => setSelectedAppliedApplication(applicant) : undefined}
                      onViewProfile={handleViewProfile}
                      onAcceptClick={handleAcceptClick}
                      onDecline={() => handleDecline(applicant)}
                      onReopen={undefined}
                      showJobInfo={false}
                    />
                  );
                })}
            </div>
          )}
        </div>

        {/* Current Plan Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Current Plan
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${subscription?.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-lg font-medium text-gray-900">
                    {subscriptionLoading ? "Loading..." : planDetails.name} Plan
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  •{" "}
                  {subscriptionLoading ? "Loading..." : (
                    subscription?.status === "active"
                      ? "Active"
                      : subscription?.status || "No active subscription"
                  )}
                  {subscription?.currentPeriodEnd &&
                    ` until ${new Date(
                      subscription.currentPeriodEnd
                    ).toLocaleDateString()}`}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mt-2">
                {subscriptionLoading
                  ? "Loading plan details..."
                  : planDetails.features.slice(0, 2).join(", ")}
                {planDetails.features.length > 2 && "..."}
              </p>
            </div>
            <div className="text-right">
              {subscriptionLoading ? (
                <p className="text-lg text-gray-500">Loading...</p>
              ) : (
                <div className="pr-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {subscription ? (
                      <>
                        $
                        {subscription?.billingCycle === "annual"
                          ? planDetails.annualPrice
                          : planDetails.monthlyPrice}
                      </>
                    ) : (
                      "Free"
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {subscription ? (
                      <>
                        per {subscription?.billingCycle || "month"}
                        {subscription?.billingCycle === "annual" && planDetails.monthlyPrice > 0 && (
                          <span className="text-green-600 font-medium">
                            {" "}
                            (Save $
                            {planDetails.monthlyPrice * 12 -
                              planDetails.annualPrice}
                            )
                          </span>
                        )}
                      </>
                    ) : (
                      "No subscription"
                    )}
                  </p>
                </div>
              )}
              <button
                onClick={() => navigate("/employer/subscription")}
                className="mt-2 px-4 py-2 text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors duration-200"
              >
                Manage Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Restrictions Modal */}
      <SubscriptionRestrictionsModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onUpgrade={() => {
          setIsSubscriptionModalOpen(false);
          navigate("/employer/subscription");
        }}
        currentPlan={subscription?.planType?.toLowerCase() || 'free'}
        activeJobCount={getActiveJobCount()}
        maxJobs={getJobPostingLimits().max}
        isFreePlan={!subscription || subscription.status !== 'active'}
      />

      {/* Repost Job Modal */}
      <RepostModal
        isOpen={isRepostModalOpen}
        onClose={() => setIsRepostModalOpen(false)}
        job={selectedRepostJob}
        onConfirm={confirmRepostJob}
      />

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

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setSelectedContactUser(null);
        }}
        user={selectedContactUser}
      />

      {/* Delete Accepted Applicant Modal */}
      <DeleteAcceptedApplicantModal
        isOpen={isDeleteAcceptedModalOpen}
        onClose={() => {
          setIsDeleteAcceptedModalOpen(false);
          setSelectedAcceptedForDelete(null);
        }}
        onConfirm={confirmDeleteAcceptedApplicant}
        applicantName={selectedAcceptedForDelete ? `${selectedAcceptedForDelete.user.firstName} ${selectedAcceptedForDelete.user.lastName}` : ""}
        jobTitle={selectedAcceptedForDelete?.job?.title || ""}
      />

      {/* Other Modals */}
      {isDeleteJobModalOpen && selectedJobForDelete && (
        <DeleteJobModal
          job={selectedJobForDelete}
          setIsOpen={setIsDeleteJobModalOpen}
          handleDeleteJob={(jobId) => {
            console.log("Delete job called from modal for job ID:", jobId);
            // Call the main handleDeleteJob function that makes the API call
            handleDeleteJob(jobId);
            setIsDeleteJobModalOpen(false);
          }}
        />
      )}

      {isJobModalOpen && selectedJob && (
        <JobModal job={selectedJob} onClose={() => setIsJobModalOpen(false)} />
      )}

      {isEditJobModalOpen && selectedEditJob && (
        <EditJobModal
          isOpen={isEditJobModalOpen}
          onClose={() => setIsEditJobModalOpen(false)}
          job={selectedEditJob}
          onJobUpdated={(updatedJob) => {
            setJobs((prevJobs) =>
              prevJobs.map((job) =>
                job.id === updatedJob.id ? updatedJob : job
              )
            );
            setIsEditJobModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default EmployerDashboard;
