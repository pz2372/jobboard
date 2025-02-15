import React from "react";
import {
  CheckCircle,
  ArrowLeft,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  Search,
  Home,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { FormatDate } from "components/methods/FormatDate";

const ApplicationSuccessPage = () => {
  const location = useLocation(); 
  const job = location.state?.job;
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-4 text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-teal-600" />
        <h1 className="text-2xl font-bold text-teal-600 font-comic">
          Application Submitted Successfully!
        </h1>
        <p className="text-gray-700 p-3">
          Your application has been sent to {job.company}
        </p>
      </div>

      <section className="mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-200">
          <h2 className="font-semibold text-lg mb-4 text-gray-900">
            Application Details
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">
                {job.title} 
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{job.minWage}-{job.maxWage}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Applied on {FormatDate(new Date)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="font-semibold text-lg mb-4 text-gray-900">
            Next Steps
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <div className="bg-teal-50 p-1 rounded-full mt-0.5">
                <CheckCircle className="w-4 h-4 text-teal-600" />
              </div>
              Watch for a confirmation from {job.company}
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-teal-50 p-1 rounded-full mt-0.5">
                <CheckCircle className="w-4 h-4 text-teal-600" />
              </div>
              Review your application status in your dashboard
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-teal-50 p-1 rounded-full mt-0.5">
                <CheckCircle className="w-4 h-4 text-teal-600" />
              </div>
              Prepare for potential interview requests
            </li>
          </ul>
        </div>
      </section>

      <div className="flex gap-4">
          <button onClick={()=>navigate("/jobs")} className="flex-1 bg-teal-600 text-white px-4 py-3 rounded-xl hover:bg-teal-700 transition-all duration-300 font-medium flex items-center justify-center gap-2">
          <Search className="w-4 h-4" />
          Browse More Jobs
            
          </button>
          <button onClick={()=>navigate("/history")} className="flex-1 bg-teal-50 text-teal-600 px-4 py-3 rounded-xl hover:bg-teal-100 transition-all duration-300 font-medium flex items-center justify-center gap-2">
          <Home className="w-4 h-4" />
          Go to Dashboard
          </button>
        </div>
    </div>
  );
};

export default ApplicationSuccessPage;
