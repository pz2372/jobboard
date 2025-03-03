import React, { useEffect, useState } from "react";
import {
  Search,
  PlusIcon,
  TrashIcon,
  UsersIcon,
  BriefcaseIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MailIcon,
  PhoneIcon,
  ExternalLinkIcon,
  CalendarIcon,
  BuildingIcon,
  FileTextIcon,
  XIcon,
} from "lucide-react";
import axiosInstance from "axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useNavigate } from "react-router-dom";
import { FormatDate } from "components/methods/FormatDate";
import DeleteJobModal from "components/DeleteJobModal";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const employer = useSelector(
    (state: RootState) => state.employerAuth.employer
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(`/employerjob/jobs/${employer.id}`)
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axiosInstance
      .get(`/employerapplication/employerAppliedApplications/${employer.id}`)
      .then((response) => {
        console.log(response.data);
        setApplications(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 py-8 rounded-3xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center ml-5 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {employer.companyName} Dashboard
          </h1>
          <button
            onClick={() => navigate("/employer/createjob")}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-500 transition-all duration-300 flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Create New Listing
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search listings..."
                className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600">
              <option>All Listings</option>
              <option>Active</option>
              <option>Closed</option>
            </select>
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
                {jobs.map((job) => {
                  return (
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <BriefcaseIcon className="w-5 h-5 text-teal-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {job.title}
                            </p>
                            <p className="text-sm text-gray-500">{job.type}</p>
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
                        {FormatDate(job.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600">
                          {job.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedJobId(job.id);
                              setIsOpen(true);
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {jobs && <div className="text-center pt-5">No Job Postings</div>}
        </div>

        {isOpen && (
          <DeleteJobModal jobId={selectedJobId} setIsOpen={setIsOpen} />
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Recent Applicants
          </h2>
          {applications ? (
            <div className="text-center">No Recent Applicants</div>
          ) : (
            <div className="space-y-4">
              {applications.map((applicant, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="space-y-1">
                      <h3 className="font-medium text-gray-900">
                        {applicant.firstName} {applicant.lastName}
                      </h3>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <MailIcon className="w-4 h-4 mr-2" />
                          {applicant.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <PhoneIcon className="w-4 h-4 mr-2" />
                          {applicant.phoneNumber}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          Applied on {applicant.createdOn}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button className="inline-flex items-center px-4 py-2 text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors duration-200">
                      <FileTextIcon className="w-4 h-4 mr-2" />
                      View Application
                    </button>
                    <button className="inline-flex items-center px-4 py-2 text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors duration-200">
                      <ExternalLinkIcon className="w-4 h-4 mr-2" />
                      View Profile
                    </button>
                    <button className="inline-flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200">
                      <XIcon className="w-4 h-4 mr-2" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
