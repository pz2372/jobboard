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
} from "lucide-react";

type Document = {
  required: boolean;
  maxSize: string;
  allowedTypes: string[];
};

// Define the type for the documents state
type Documents = {
  [documentType: string]: Document;
};

type Question = {
  id: number;
  type: "text" | "multiple" | "yesno"; // Add other types as needed
  question: string;
  required: boolean;
  options: string[];
};

type QuestionType = "text" | "multiple" | "yesno";

type QuestionCategories = "Experience" | "Background" | "Skills" | "Culture";

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

const CreateApplication = () => {
  const [currentStep, setCurrentStep] = useState(2);
  const [showPreview, setShowPreview] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [documents, setDocuments] = useState<Documents>({
    resume: {
      required: true,
      maxSize: "5MB",
      allowedTypes: ["PDF", "DOC", "DOCX"],
    },
    coverLetter: {
      required: false,
      maxSize: "5MB",
      allowedTypes: ["PDF", "DOC", "DOCX"],
    },
  });
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: 0,
    type: "text",
    question: "",
    required: false,
    options: [""],
  });
  const [usedQuestions, setUsedQuestions] = useState(new Set());

  const handleDocumentRequirementToggle = (documentType: string) => {
    setDocuments((prev) => ({
      ...prev,
      [documentType]: {
        ...prev[documentType],
        required: !prev[documentType].required,
      },
    }));
  };

  const fullQuestionPool: Record<QuestionCategories, string[]> = {
    Experience: [
      "What makes you a good fit for this position?",
      "Describe your most relevant work experience.",
      "What are your salary expectations?",
      "What was your biggest professional achievement?",
      "How do you handle challenging workplace situations?",
      "What is your management style?",
      "Describe a successful project you led",
      "How do you prioritize your work?",
      "What are your career goals for the next 5 years?",
      "How do you stay updated in your field?",
    ],
    Background: [
      "Are you legally authorized to work in the United States?",
      "Have you previously worked for our company?",
      "When can you start?",
      "What is your highest level of education?",
      "Do you have any professional certifications?",
      "Have you worked in similar industries before?",
      "What languages do you speak?",
      "Are you willing to relocate?",
      "Can you work overtime if needed?",
      "Do you have any security clearances?",
    ],
    Skills: [
      "Do you have experience with required technical skills?",
      "What is your proficiency level in relevant software?",
      "List any relevant certifications you hold.",
      "Rate your problem-solving abilities",
      "How comfortable are you with new technologies?",
      "Describe your experience with team collaboration tools",
      "What programming languages are you proficient in?",
      "How do you approach learning new skills?",
      "What is your experience with project management?",
      "Describe your analytical capabilities",
    ],
    Culture: [
      "How do you contribute to team culture?",
      "What type of work environment do you prefer?",
      "How do you handle workplace conflicts?",
      "What motivates you at work?",
      "How do you maintain work-life balance?",
      "What are your core professional values?",
      "How do you handle feedback?",
      "Describe your ideal company culture",
      "How do you collaborate with diverse teams?",
      "What makes a great workplace for you?",
    ],
  };


  const [availableQuestions, setAvailableQuestions] = useState(
    Object.fromEntries(
      Object.entries(fullQuestionPool).map(([category, questions]) => [
        category,
        questions.filter((q) => !usedQuestions.has(q)),
      ])
    )
  );


  const handleAddQuestion = () => {
    if (newQuestion.question.trim()) {
      setQuestions([
        ...questions,
        {
          ...newQuestion,
          id: Date.now(), 
        },
      ]);
      setNewQuestion({
        id: Date.now(),
        type: "text",
        question: "",
        required: false,
        options: [""],
      });
    }
  };


  const handleRemoveQuestion = (id: number) => {
    const questionToRemove = questions.find((q) => q.id === id);
    if (questionToRemove) {
      setUsedQuestions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(questionToRemove.question);
        return newSet;
      });
      setAvailableQuestions((prev) => {
        const newQuestions = {
          ...prev,
        };
        Object.keys(newQuestions).forEach((category) => {
          if (fullQuestionPool[category as keyof typeof fullQuestionPool].includes(questionToRemove.question)) {
            newQuestions[category] = [
              ...newQuestions[category],
              questionToRemove.question,
            ];
          }
        });
        return newQuestions;
      });
    }
    setQuestions(questions.filter((q) => q.id !== id));
  };


  const handleOptionChange = (questionId: number, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return {
            ...q,
            options: newOptions,
          };
        }
        return q;
      })
    );
  };


  const handleAddOption = (questionId: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: [...q.options, ""],
          };
        }
        return q;
      })
    );
  };


  const handleRemoveOption = (questionId: number, optionIndex: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = q.options.filter(
            (_, index) => index !== optionIndex
          );
          return {
            ...q,
            options: newOptions,
          };
        }
        return q;
      })
    );
  };


  const addSuggestedQuestion = (question: string, category: QuestionCategories) => {
    if (!usedQuestions.has(question)) {
      setQuestions([
        ...questions,
        {
          id: Date.now(),
          type: "text",
          question,
          required: false,
          options: [""],
        },
      ]);
      setUsedQuestions((prev) => new Set(prev).add(question));
      setAvailableQuestions((prev) => ({
        ...prev,
        [category]: prev[category].filter((q) => q !== question),
      }));
    }
  };


  const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="Enter your phone number"
                  />
                </div>
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
                            className="h-4 w-4 text-teal-600 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Yes
                          </span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            disabled
                            name={`question-${q.id}`}
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

  return (
    <div className="max-w-3xl mx-auto mt-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Application Setup
        </h1>
        <p className="text-sm text-gray-500">* Required fields</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MailIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <PhoneIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Document Requirements
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <FileTextIcon className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Resume</h3>
                  <p className="text-sm text-gray-500">
                    PDF, DOC, or DOCX (Max 5MB)
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={documents.resume.required}
                  onChange={() => handleDocumentRequirementToggle("resume")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Required
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <FileTextIcon className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Cover Letter
                  </h3>
                  <p className="text-sm text-gray-500">
                    PDF, DOC, or DOCX (Max 5MB)
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={documents.coverLetter.required}
                  onChange={() =>
                    handleDocumentRequirementToggle("coverLetter")
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Required
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Custom Questions
          </h2>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <select
                  value={newQuestion.type}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      type: e.target.value as QuestionType,
                    })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="text">Text Answer</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="yesno">Yes/No</option>
                </select>
                <div className="flex-1">
                  <input
                    type="text"
                    value={newQuestion.question}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        question: e.target.value,
                      })
                    }
                    placeholder="Enter your question..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <button
                  onClick={handleAddQuestion}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                >
                  Add Question
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="p-4 border border-gray-200 rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <GripVerticalIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium">{q.question}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={q.required}
                          onChange={() =>
                            setQuestions(
                              questions.map((question) =>
                                question.id === q.id
                                  ? {
                                      ...question,
                                      required: !question.required,
                                    }
                                  : question
                              )
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          Required
                        </span>
                      </label>
                      <button
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {q.type === "multiple" && (
                    <div className="pl-8 space-y-2">
                      {q.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(q.id, index, e.target.value)
                            }
                            placeholder={`Option ${index + 1}`}
                            className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                          <button
                            onClick={() => handleRemoveOption(q.id, index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <XIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddOption(q.id)}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                      >
                        + Add Option
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">
                Suggested Questions
              </h3>
              {Object.entries(availableQuestions).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <p className="text-sm text-gray-600">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((question) => (
                      <button
                        key={question}
                        onClick={() => addSuggestedQuestion(question, category as QuestionCategories)}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                      >
                        {question}
                        <PlusIcon className="w-4 h-4 ml-1" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <EyeIcon className="w-5 h-5 mr-2" />
            Preview
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            <SaveIcon className="w-5 h-5 mr-2" />
            Publish Job
          </button>
        </div>
      </div>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
};

export default CreateApplication;
