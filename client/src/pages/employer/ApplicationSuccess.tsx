import React from "react";
import {
  Share2Icon,
  LinkIcon,
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

const ApplicationSuccess = ({ formData }: any) => {
  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto mt-16">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
              <CheckIcon className="w-5 h-5 text-teal-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Application Form Created!
            </h1>
          </div>
          <p className="text-gray-600">
            Your custom application form is ready to receive applications.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">Active</div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">
                30 days
              </div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-transparent hover:border-teal-500 cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                <Share2Icon className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="font-medium text-gray-900">Share</h3>
            </div>
            <input
              type="text"
              value="https://jobs.company.com/apply/dev-123"
              readOnly
              className="w-full text-sm bg-gray-50 border rounded-lg px-3 py-2 mb-2"
            />
            <button className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
              <LinkIcon className="w-4 h-4" />
              Copy link
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-transparent hover:border-teal-500 cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                <EyeIcon className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="font-medium text-gray-900">Preview</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Preview how candidates will see your application form
            </p>
            <button className="text-sm text-teal-600 hover:text-teal-700">
              View application page
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
            Go to Dashboard
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            View Job Posting
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSuccess;
