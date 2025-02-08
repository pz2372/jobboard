import React from "react";
import {
  CheckCircle,
  ArrowRight,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Home,
  Search,
} from "lucide-react";

const ApplicationPage = () => {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="bg-teal-50 p-4 rounded-full">
            <CheckCircle className="w-16 h-16 text-teal-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Application Submitted Successfully!
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Your application has been sent to Tech Solutions Inc
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-200">
        <h2 className="font-semibold text-lg mb-4 text-gray-900">
          Application Details
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              Junior Web Developer at Tech Solutions Inc
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Remote</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">$60-75k/year</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Applied on Sept 15, 2023</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-200">
        <h2 className="font-semibold text-lg mb-4 text-gray-900">Next Steps</h2>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start gap-3">
            <div className="bg-teal-50 p-1 rounded-full mt-0.5">
              <CheckCircle className="w-4 h-4 text-teal-600" />
            </div>
            Watch for an email confirmation from Tech Solutions Inc
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
      <div className="flex gap-4">
        <button className="flex-1 bg-teal-600 text-white px-4 py-3 rounded-xl hover:bg-teal-700 transition-all duration-300 font-medium flex items-center justify-center gap-2">
          <Home className="w-4 h-4" />
          Back to Dashboard
        </button>
        <button className="flex-1 bg-teal-50 text-teal-600 px-4 py-3 rounded-xl hover:bg-teal-100 transition-all duration-300 font-medium flex items-center justify-center gap-2">
          <Search className="w-4 h-4" />
          Browse More Jobs
        </button>
      </div>
    </main>
  );
};

export default ApplicationPage;
