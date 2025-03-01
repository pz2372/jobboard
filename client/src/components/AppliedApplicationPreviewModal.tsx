import { XIcon } from "lucide-react";
import React from "react";

type PreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  basicFields: Record<string, { enabled: boolean; required: boolean }>;
  documents: Documents;
  questions: Question[];
  basicFieldAnswers: [];
  questionAnswers: [];
};

type Document = {
  required: boolean;
  maxSize: string;
  allowedTypes: string[];
};

type Documents = {
  [documentType: string]: Document;
};

type Question = {
  id: number;
  type: "text" | "multiple" | "yesno";
  question: string;
  required: boolean;
  options: string[];
};

const AppliedApplicationPreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  basicFields,
  documents,
  questions,
  basicFieldAnswers,
  questionAnswers,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky  top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Application Preview
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {basicFields &&
                Object.entries(basicFields).map(([key, field]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      disabled
                      value={basicFieldAnswers[key]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      placeholder={`Enter your ${key}`}
                    />
                  </div>
                ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Documents</h3>
            <div className="space-y-2">
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  Resume{" "}
                  {documents.resume.required && (
                    <span className="text-red-500">*</span>
                  )}
                </p>
                <input
                  type="file"
                  disabled
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  Cover Letter{" "}
                  {documents.coverLetter.required && (
                    <span className="text-red-500">*</span>
                  )}
                </p>
                <input
                  type="file"
                  disabled
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Questions</h3>
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {q.question}{" "}
                    {q.required && <span className="text-red-500">*</span>}
                  </label>
                  {q.type === "text" && (
                    <textarea
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      rows={3}
                      value={questionAnswers[q.id]}
                      placeholder="Enter your answer"
                    />
                  )}
                  {q.type === "multiple" && (
                    <div className="space-y-2">
                      {q.options.map((option, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="radio"
                            disabled
                            name={`question-${q.id}`}
                            value={option}
                            checked={questionAnswers?.[q.id] === option}
                            className="h-4 w-4 text-teal-600 border-gray-300"
                          />
                          <label className="ml-2 text-sm text-gray-700">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                  {q.type === "yesno" && (
                    <div className="space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          disabled
                          name={`question-${q.id}`}
                          value="Yes"
                          checked={questionAnswers?.[q.id] === "Yes"}
                          className="h-4 w-4 text-teal-600 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          disabled
                          name={`question-${q.id}`}
                          value="No"
                          checked={questionAnswers?.[q.id] === "No"}
                          className="h-4 w-4 text-teal-600 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppliedApplicationPreviewModal;
