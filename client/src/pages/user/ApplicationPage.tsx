import React, { useState, useEffect } from "react";
import { RootState } from "redux/store";
import { useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "axiosInstance";
import {
  CalendarIcon,
  GraduationCapIcon,

} from "lucide-react";
import { Job } from "components/interfaces/Job";
import { applicationFieldMap } from "../../components/ApplicationFieldMap";

type Field = {
  name?: string;
  enabled: boolean;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type BasicFieldsState = {
  fullName: Field;
  email: Field;
  phone: Field;
  address: Field;
  city: Field;
  state: Field;
  zipCode: Field;
  currentCompany: Field;
  yearsExperience: Field;
  educationLevel: Field;
  pronouns: Field;
  startDate: Field;
};

interface ApplicationQuestion {
  id: number;
  question: string;
  type: "text" | "multiple" | "yesno";
  options?: string[];
}

type Document = {
  required: boolean;
  maxSize: string;
  allowedTypes: string[];
};

interface DocumentsState {
  [key: string]: Document;
}

const ApplicationPage = () => {
  const { application: applicationParam } = useParams();
  const location = useLocation();
  const application = location.state?.application || applicationParam;
  const user = useSelector((state: RootState) => state.auth.user);
  const [employerId, setEmployerId] = useState<number>(0);
  const [questions, setQuestions] = useState<ApplicationQuestion[]>([]);
  const [basicFields, setBasicFields] = useState<Partial<BasicFieldsState>>({});
  const [documents, setDocuments] = useState<DocumentsState>({
    resume: {
      required: false,
      maxSize: "5MB",
      allowedTypes: ["PDF", "DOC", "DOCX"],
    },
    coverLetter: {
      required: false,
      maxSize: "5MB",
      allowedTypes: ["PDF", "DOC", "DOCX"],
    },
  });
  const [job, setJob] = useState<any>({ title: "", company: "" });
  const [jobApplicationId, setJobApplicationId] = useState(0);
  const [basicFieldAnswers, setBasicFieldAnswers] = useState({});
  const [questionAnswers, setQuestionAnswers] = useState<{
    [key: string]: any;
  }>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
        setEmployerId(application.application.employerId);
        setBasicFields(application.application.basicFields);
        setDocuments(application.application.documents);
        setQuestions(application.application.questions);
        setJobApplicationId(application.application.id);
        setJob(application.application.job);
  }, []);

  const handleAnswerChange = (questionId: number, answer: any): void => {
    setQuestionAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

    const handleSubmitApplication = async () => {
    try {
      // Validate that all questions are answered
      const unansweredQuestions: string[] = [];
      
      if (questions && Array.isArray(questions)) {
        questions.forEach((question: any, index: number) => {
          const answer = questionAnswers[question.id];
          
          // Check if question is unanswered based on question type
          if (question.type === 'text' || question.type === 'email' || question.type === 'number') {
            if (!answer || (typeof answer === 'string' && answer.trim() === '')) {
              unansweredQuestions.push(question.question || `Question ${index + 1}`);
            }
          } else if (question.type === 'multiple' || question.type === 'yesno') {
            if (!answer) {
              unansweredQuestions.push(question.question || `Question ${index + 1}`);
            }
          }
        });
      }

      // If there are unanswered questions, show errors and don't submit
      if (unansweredQuestions.length > 0) {
        setValidationErrors(unansweredQuestions);
        return;
      }

      // Clear validation errors if all questions are answered
      setValidationErrors([]);

      const applicationPayload = {
        jobId: job?.id,
        userId: user?.id,
        status: "pending",
        applicationData: {
          questions: questions || [],
          answers: questionAnswers,
          basicFields: basicFieldAnswers,
        },
      };

      console.log("Submitting application:", applicationPayload);

      const response = await axiosInstance.post(`/applications/job/${job?.id}/apply`, applicationPayload);
      console.log("Application submitted successfully:", response.data);
      
      alert('Application submitted successfully!');
      navigate('/jobs');
    } catch (error) {
      console.error("Error submitting application:", error);
      alert('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-teal-600 font-comic">
          {job.companyName} Application
        </h1>
        <h3 className="text-2xl mb-5 text-teal-600 font-comic">{job.title}</h3>
      </div>
      <form className="space-y-6">
        <div className="space-y-6">
          {/* Personal Information Group */}

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 border-b pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["fullName", "email", "phone", "pronouns"]
                .filter((key: string) => {
                  const field = basicFields?.[key as keyof BasicFieldsState];
                  return field && field.enabled; // Only include fields that exist and are enabled
                })
                .map((key: string) => {
                  const field = basicFields?.[key as keyof BasicFieldsState];
                  const IconComponent = applicationFieldMap[key]?.icon;

                  return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {applicationFieldMap[key]?.name}{" "}
                        
                      </label>
                    </div>
                    <div className="relative">
                      {IconComponent && (
                        <IconComponent className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      )}
                      <input
                        type="text"
                        
                        placeholder={field.name}
                        onChange={(e) => {
                          setBasicFieldAnswers((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }));
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Address Group */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 border-b pb-2">
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["address", "city", "state", "zipCode"]
                .filter((key: string) => {
                  const field = basicFields?.[key as keyof BasicFieldsState];
                  return field && field.enabled; // Only include fields that exist and are enabled
                })
                .map((key: string) => {
                  const field = basicFields?.[key as keyof BasicFieldsState];
                  const IconComponent = applicationFieldMap[key]?.icon;

                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {applicationFieldMap[key]?.name}{" "}
                       
                      </label>
                    </div>
                    <div className="relative">
                      {IconComponent && (
                        <IconComponent className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      )}
                      <input
                        type="text"
                       
                        placeholder={field.name}
                        onChange={(e) => {
                          setBasicFieldAnswers((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }));
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Professional Information Group */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 border-b pb-2">
              Professional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "currentCompany",
                "yearsExperience",
                "educationLevel",
                "startDate",
              ]
                .filter((key: string) => {
                  const field = basicFields?.[key as keyof BasicFieldsState];
                  return field && field.enabled; // Only include fields that exist and are enabled
                })
                .map((key: string) => {
                  const field = basicFields[key as keyof BasicFieldsState];
                  const IconComponent = applicationFieldMap[key]?.icon;

                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {applicationFieldMap[key]?.name}{" "}
                       
                      </label>
                    </div>
                    <div className="relative">
                      {/* Custom logic for Education Level */}
                      {key === "educationLevel" && (
                        <>
                          <GraduationCapIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <select
                            
                            onChange={(e) => {
                              setBasicFieldAnswers((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }));
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            <option value="">Select Education Level</option>
                            <option value="high_school">High School</option>
                            <option value="associates">
                              Associate's Degree
                            </option>
                            <option value="bachelors">Bachelor's Degree</option>
                            <option value="masters">Master's Degree</option>
                            <option value="doctorate">Doctorate</option>
                          </select>
                        </>
                      )}
                      {/* Custom logic for Start Date */}
                      {key === "startDate" && (
                        <>
                          <CalendarIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="date"
                           
                            onChange={(e) => {
                              setBasicFieldAnswers((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }));
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </>
                      )}
                      {/* Default input for other fields */}
                      {key !== "educationLevel" && key !== "startDate" && (
                        <>
                          {IconComponent && (
                            <IconComponent className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          )}
                          <input
                            type="text"
                          
                            placeholder={field.name}
                            onChange={(e) => {
                              setBasicFieldAnswers((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }));
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {(documents.resume.required || documents.coverLetter.required) && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Documents</h3>
            <div className="space-y-2">
              {documents.resume.required && (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Resume</p>
                  <input
                    type="file"
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 hover:cursor-pointer"
                  />
                </div>
              )}
              {documents.coverLetter.required && (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">
                    Cover Letter
                  </p>
                  <input
                    type="file"
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 hover:cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {questions.map((q, index) => (
          <div key={q.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {q.question}{" "}
            </label>
            {q.type === "text" && (
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={3}
                placeholder="Enter your answer"
                value={questionAnswers[q.id] || ""}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              />
            )}
            {q.type === "multiple" && (
              <div className="space-y-2">
                {q.options?.map((option: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      className="h-4 w-4 text-teal-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      checked={questionAnswers[q.id] === option}
                      onChange={() => handleAnswerChange(q.id, option)}
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
                    name={`question-${q.id}`}
                    className="h-4 w-4 text-teal-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    checked={questionAnswers[q.id] === "yes"}
                    onChange={() => handleAnswerChange(q.id, "yes")}
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    className="h-4 w-4 text-teal-600 border-gray-300"
                    checked={questionAnswers[q.id] === "no"}
                    onChange={() => handleAnswerChange(q.id, "no")}
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            )}
          </div>
        ))}
        
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-red-800 font-medium mb-2">Please answer the following questions:</h4>
            <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-center">
          <button
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            onClick={handleSubmitApplication}
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationPage;
