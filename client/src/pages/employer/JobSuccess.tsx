import React, { useState } from "react";
import {
  PlusIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  FileTextIcon,
  ListChecksIcon,
  XIcon,
  SaveIcon,
  EyeIcon,
  TrashIcon,
  GripVerticalIcon,
  AlertCircleIcon,
  MapPinIcon,
  LinkedinIcon,
  GlobeIcon,
  BuildingIcon,
  ClockIcon,
  GraduationCapIcon,
  CalendarIcon,
  UserCircleIcon,
  ArrowRightIcon,
  CheckIcon,
  LayoutIcon,
  ListIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const JobSuccess = () => {
  const navigate = useNavigate();
  const locate = useLocation();
  const { jobId, title, location, type } = locate.state || {};

  return (
    <div className="w-full min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto mt-16">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
              <CheckIcon className="w-5 h-5 text-teal-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Job Successfully Posted!
            </h1>
          </div>
          <p className="text-gray-600">
            Your job listing is now live. Next, choose how you'd like to handle
            applications.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Job Summary
          </h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <span className="font-medium">Title:</span>{" "}
              {title || "Software Engineer"}
            </p>
            <p>
              <span className="font-medium">Location:</span>{" "}
              {location || "Remote"}
            </p>
            <p>
              <span className="font-medium">Type:</span>{" "}
              {type || "Full-time"}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm p-8 border-2 border-transparent cursor-pointer transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                <LayoutIcon className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-medium text-gray-900">
                Custom Application Form
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Create a tailored application form with custom questions and
              specific requirements for your role.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-teal-600" />
                Customizable fields
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-teal-600" />
                Screening questions
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-teal-600" />
                Document requirements
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => {
              navigate("/employer");
            }}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => {
              navigate(`/employer/createapplication/${jobId}`);
            }}
            className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Create Custom Application
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobSuccess;
