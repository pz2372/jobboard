import {
  Share2Icon,
  LinkIcon,
  EyeIcon,
  ArrowRightIcon,
  CheckIcon,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PreviewModal from "components/PreviewModal";

const ApplicationSuccess = ({ formData }: any) => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const location = useLocation();
  const { questions, basicFields, documents } = location.state;
  const requiredDocuments =
    (documents.resume.required ? "Resume" : "") +
    (documents.resume.required && documents.coverLetter.required ? ", " : "") +
    (documents.coverLetter.required ? "Cover Letter" : "");
  let customQuestions = 0;

  for (var i = 0; i < questions.length; i++) {
    customQuestions++;
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 mb-16">
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        basicFields={basicFields}
        documents={documents}
        questions={questions}
      />

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
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

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Form Settings Summary
        </h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <span className="font-medium">Required Fields:</span>{" "}
            {requiredDocuments}
          </p>
          <p>
            <span className="font-medium">Custom Questions:</span>{" "}
            {customQuestions}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">Active</div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">30 days</div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-transparent cursor-pointer">
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

        <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-transparent cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
              <EyeIcon className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="font-medium text-gray-900">Preview</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Preview how candidates will see your application form
          </p>
          <button onClick={()=>setShowPreview(true)} className="text-sm text-teal-600 hover:text-teal-700">
            View application
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={() => navigate("/employer")}
          className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Go to Dashboard
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ApplicationSuccess;
