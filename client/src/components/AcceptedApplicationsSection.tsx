import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Building2,
  MapPin,
  Calendar,
} from "lucide-react";
import { FormatDate } from "./methods/FormatDate";
import JobModal from "./JobModal";

interface AcceptedApplication {
  id: number;
  status: string;
  acceptedDate?: string;
  job?: {
    id?: number;
    title?: string;
    companyName?: string;
    company?: string;
    location?: string;
    city?: string;
    state?: string;
  };
}

interface AcceptedApplicationsSectionProps {
  acceptedApplications: AcceptedApplication[];
}

const AcceptedApplicationsSection: React.FC<AcceptedApplicationsSectionProps> = ({
  acceptedApplications,
}) => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  if (acceptedApplications.length === 0) {
    return null;
  }

  const handleJobTitleClick = (job: any) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  const handleCompanyClick = (companyName: string) => {
    if (companyName) {
      navigate(`/company/${encodeURIComponent(companyName)}`);
    }
  };

  const closeJobModal = () => {
    setIsJobModalOpen(false);
    setSelectedJob(null);
  };

  // Sort applications by acceptedDate (newest first)
  const sortedApplications = [...acceptedApplications].sort((a, b) => {
    if (!a.acceptedDate || !b.acceptedDate) return 0;
    return new Date(b.acceptedDate).getTime() - new Date(a.acceptedDate).getTime();
  });

  // Show only first 3 applications by default
  const displayedApplications = showAll ? sortedApplications : sortedApplications.slice(0, 3);
  const hasMoreApplications = sortedApplications.length > 3;

  return (
    <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white rounded-lg">
          <CheckCircle className="w-6 h-6 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold text-teal-600">Accepted Applications</h2>
        <span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-sm font-medium border border-teal-200">
          {acceptedApplications.length}
        </span>
      </div>
      
      <div className="grid gap-4">
        {displayedApplications.map((application, index) => (
          <div
            key={index}
            className="bg-teal-50 border border-teal-200 rounded-xl p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 
                  className="font-semibold text-lg text-teal-700 mb-2 cursor-pointer hover:text-teal-800 transition-colors"
                  onClick={() => handleJobTitleClick(application.job)}
                >
                  {application.job?.title || "Job Title"}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-teal-500" />
                    <span 
                      className="cursor-pointer hover:text-teal-600 transition-colors"
                      onClick={() => handleCompanyClick(application.job?.companyName || application.job?.company || "")}
                    >
                      {application.job?.companyName || application.job?.company || "Company"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-teal-500" />
                    <span>
                      {application.job?.city && application.job?.state 
                        ? `${application.job.city}, ${application.job.state}`
                        : application.job?.location || "Location"
                      }
                    </span>
                  </div>
                </div>
                {application.acceptedDate && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-teal-500" />
                    <span>Accepted on {FormatDate(new Date(application.acceptedDate))}</span>
                  </div>
                )}
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                ✓ Accepted
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Show Less Button */}
      {hasMoreApplications && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-teal-50 hover:bg-teal-100 text-teal-600 px-6 py-2 rounded-lg border border-teal-200 font-medium transition-colors duration-200"
          >
            {showAll ? `Show Less` : `Show More (${sortedApplications.length - 3} more)`}
          </button>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-xl">
        <p className="text-teal-700 text-sm">
          🎉 Congratulations! These employers have accepted your applications. 
          They should contact you soon with next steps.
        </p>
      </div>

      {/* Job Modal */}
      {isJobModalOpen && selectedJob && (
        <JobModal 
          job={selectedJob} 
          onClose={closeJobModal}
          showApplyButton={false}
        />
      )}
    </section>
  );
};

export default AcceptedApplicationsSection;
