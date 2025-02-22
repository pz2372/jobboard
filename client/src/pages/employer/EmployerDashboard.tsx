import React, { useEffect } from "react";
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
} from "lucide-react";
import axiosInstance from "axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useNavigate } from "react-router-dom";

const EmployerDashboard = () => {
  const employer = useSelector(
    (state: RootState) => state.employerAuth.employer
  );
  const navigate = useNavigate()

  console.log(employer)
  
  useEffect(() => {
    //axiosInstance.get("/employerjob/")
  })

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 py-8 rounded-3xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center ml-5 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {employer.companyName} Dashboard
          </h1>
          <button onClick={()=> navigate("/employer/createjob")} className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-500 transition-all duration-300 flex items-center gap-2">
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
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <BriefcaseIcon className="w-5 h-5 text-teal-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Senior Developer
                        </p>
                        <p className="text-sm text-gray-500">
                          Full-time • Remote
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <UsersIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">24 applicants</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">Oct 15, 2023</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <BriefcaseIcon className="w-5 h-5 text-teal-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Product Designer
                        </p>
                        <p className="text-sm text-gray-500">
                          Full-time • On-site
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <UsersIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">12 applicants</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">Oct 12, 2023</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Applicants
            </h2>
            <button className="text-teal-600 hover:text-teal-500 font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Sarah Wilson</h3>
                    <p className="text-gray-500 text-sm">
                      Applied for Senior Developer
                    </p>
                    <div className="flex gap-4 mt-2">
                      <a
                        href="mailto:sarah@example.com"
                        className="text-gray-500 hover:text-teal-600 flex items-center gap-1 text-sm"
                      >
                        <MailIcon className="w-4 h-4" />
                        sarah@example.com
                      </a>
                      <a
                        href="tel:+1234567890"
                        className="text-gray-500 hover:text-teal-600 flex items-center gap-1 text-sm"
                      >
                        <PhoneIcon className="w-4 h-4" />
                        (123) 456-7890
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-teal-600 transition-colors">
                    <ExternalLinkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Michael Chen</h3>
                    <p className="text-gray-500 text-sm">
                      Applied for Product Designer
                    </p>
                    <div className="flex gap-4 mt-2">
                      <a
                        href="mailto:michael@example.com"
                        className="text-gray-500 hover:text-teal-600 flex items-center gap-1 text-sm"
                      >
                        <MailIcon className="w-4 h-4" />
                        michael@example.com
                      </a>
                      <a
                        href="tel:+1234567890"
                        className="text-gray-500 hover:text-teal-600 flex items-center gap-1 text-sm"
                      >
                        <PhoneIcon className="w-4 h-4" />
                        (123) 456-7890
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-teal-600 transition-colors">
                    <ExternalLinkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
