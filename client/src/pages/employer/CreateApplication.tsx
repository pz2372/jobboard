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
  CalendarIcon,
  BuildingIcon,
  GlobeIcon,
  LinkedinIcon,
  MapPinIcon,
  ClockIcon,
  GraduationCapIcon,
  UserCircleIcon,
} from "lucide-react";
import PreviewModal from "components/PreviewModal";
import { fullQuestionPool } from "components/FullQuestionPool";
import axiosInstance from "axiosInstance";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { RootState } from "redux/store";
import { useSelector } from "react-redux";

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

type QuestionType = "text" | "multiple" | "yesno";

type QuestionCategories = "Experience" | "Background" | "Skills" | "Culture";

const CreateApplication = () => {
  const { jobId } = useParams();
  const employer = useSelector(
    (state: RootState) => state.employerAuth.employer
  );
  const [currentStep] = useState(2);
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
  const [basicFields, setBasicFields] = useState({
    fullName: {
      enabled: true,
      required: true,
    },
    email: {
      enabled: true,
      required: true,
    },
    phone: {
      enabled: true,
      required: false,
    },
    address: {
      enabled: true,
      required: false,
    },
    city: {
      enabled: true,
      required: false,
    },
    state: {
      enabled: true,
      required: false,
    },
    zipCode: {
      enabled: true,
      required: false,
    },
    linkedin: {
      enabled: true,
      required: false,
    },
    website: {
      enabled: true,
      required: false,
    },
    currentCompany: {
      enabled: true,
      required: false,
    },
    yearsExperience: {
      enabled: true,
      required: false,
    },
    educationLevel: {
      enabled: true,
      required: false,
    },
    pronouns: {
      enabled: true,
      required: false,
    },
    startDate: {
      enabled: true,
      required: false,
    },
  });

  const toggleField = (field, type) => {
    setBasicFields((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: !prev[field][type],
      },
    }));
  };

  const navigate = useNavigate();

  const handleDocumentRequirementToggle = (documentType: string) => {
    setDocuments((prev) => ({
      ...prev,
      [documentType]: {
        ...prev[documentType],
        required: !prev[documentType].required,
      },
    }));
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
          if (
            fullQuestionPool[
              category as keyof typeof fullQuestionPool
            ].includes(questionToRemove.question)
          ) {
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

  const handleOptionChange = (
    questionId: number,
    optionIndex: number,
    value: string
  ) => {
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

  const addSuggestedQuestion = (
    question: string,
    category: QuestionCategories
  ) => {
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

  const handleCreateApplication = () => {
    const data = {
      questions,
      basicFields,
      documents,
      employerId: employer.id,
      jobId: Number(jobId),
    };

    axiosInstance
      .post("/employerapplication/create", data)
      .then((response) =>
        navigate("/employer/applicationsuccess", {
          state: {
            questions,
            basicFields,
            documents,
          },
        })
      )
      .catch((error) => console.error(error));
  };


  return (
    <div className="max-w-3xl mx-auto mt-16">
      <div className="ml-5 flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Application Setup
        </h1>
        <p className="text-sm text-gray-500">*Toggle to make fields required</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Basic Information
              </h2>
              <button
                className="text-sm text-teal-600 hover:text-teal-700"
                onClick={() => {}}
              >
                Manage Fields
              </button>
            </div>

            <div className="space-y-6">
              {/* Personal Information Group */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 border-b pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name{" "}
                        {basicFields.fullName.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={basicFields.fullName.required}
                          onChange={() => toggleField("fullName", "required")}
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                    <div className="relative">
                      <UserIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required={basicFields.fullName.required}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Email{" "}
                        {basicFields.email.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={basicFields.email.required}
                          onChange={() => toggleField("email", "required")}
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                    <div className="relative">
                      <MailIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        required={basicFields.email.required}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number{" "}
                        {basicFields.phone.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={basicFields.phone.required}
                          onChange={() => toggleField("phone", "required")}
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                    <div className="relative">
                      <PhoneIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        required={basicFields.phone.required}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Group */}

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 border-b pb-2">
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Street Address{" "}
                        {basicFields.address.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={basicFields.address.required}
                          onChange={() => toggleField("address", "required")}
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                    <div className="relative">
                      <MapPinIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required={basicFields.address.required}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        City{" "}
                        {basicFields.city.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={basicFields.city.required}
                          onChange={() => toggleField("city", "required")}
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                    <input
                      type="text"
                      required={basicFields.city.required}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        State{" "}
                        {basicFields.state.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={basicFields.state.required}
                          onChange={() => toggleField("state", "required")}
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                    <input
                      type="text"
                      required={basicFields.state.required}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        ZIP Code{" "}
                        {basicFields.zipCode.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={basicFields.zipCode.required}
                          onChange={() => toggleField("zipCode", "required")}
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                    <input
                      type="text"
                      required={basicFields.zipCode.required}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information Group */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 border-b pb-2">
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Current Company{" "}
                        {basicFields.currentCompany.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={basicFields.currentCompany.required}
                          onChange={() =>
                            toggleField("currentCompany", "required")
                          }
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                    <div className="relative">
                      <BuildingIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required={basicFields.currentCompany.required}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Years of Experience{" "}
                        {basicFields.yearsExperience.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={basicFields.yearsExperience.required}
                          onChange={() =>
                            toggleField("yearsExperience", "required")
                          }
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                    <div className="relative">
                      <ClockIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        required={basicFields.yearsExperience.required}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Education Level{" "}
                        {basicFields.educationLevel.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={basicFields.educationLevel.required}
                          onChange={() =>
                            toggleField("educationLevel", "required")
                          }
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                    <div className="relative">
                      <GraduationCapIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        required={basicFields.educationLevel.required}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Select Education Level</option>
                        <option value="high_school">High School</option>
                        <option value="associates">Associate's Degree</option>
                        <option value="bachelors">Bachelor's Degree</option>
                        <option value="masters">Master's Degree</option>
                        <option value="doctorate">Doctorate</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Availability Start Date{" "}
                        {basicFields.startDate.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={basicFields.startDate.required}
                          onChange={() => toggleField("startDate", "required")}
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                    <div className="relative">
                      <CalendarIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        required={basicFields.startDate.required}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
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
                        onClick={() =>
                          addSuggestedQuestion(
                            question,
                            category as QuestionCategories
                          )
                        }
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
            onClick={handleCreateApplication}
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            <SaveIcon className="w-5 h-5 mr-2" />
            Create Application
          </button>
        </div>
      </div>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        basicFields={basicFields}
        documents={documents}
        questions={questions}
      />
    </div>
  );
};

export default CreateApplication;
