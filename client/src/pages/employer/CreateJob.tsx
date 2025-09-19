import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  BuildingIcon,
  BriefcaseIcon,
  MapPinIcon,
  DollarSignIcon,
  FileTextIcon,
  TagIcon,
  SaveIcon,
  XIcon,
  HomeIcon,
  MapIcon,
  HashIcon,
  CheckCircleIcon,
} from "lucide-react";
import { industries } from "components/Industries";
import { useNavigate } from "react-router-dom";
import axiosInstance from "axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import UploadImageModal from "../../components/UploadImageModal";

const CreateJob = () => {
  const employer = useSelector(
    (state: RootState) => state.employerAuth.employer
  );
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState<string>("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");
  const navigate = useNavigate();
  const [jobImage, setJobImage] = useState<File | null>(null);
  const [jobImagePreview, setJobImagePreview] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [jobData, setJobData] = useState({
    title: "",
    type: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    department: "",
    industry: "",
    experienceLevel: "",
    minWage: "",
    maxWage: "",
    description: "",
    compensation: "",
    payRate: "",
    payFrequency: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    
    // Validation functions
    const validateNumeric = (val: string) => /^\d*$/.test(val);
    const validateDecimalNumber = (val: string) => /^\d*\.?\d*$/.test(val);
    const validateLettersAndSpaces = (val: string) => /^[a-zA-Z\s]*$/.test(val);
    const validateLettersOnly = (val: string) => /^[a-zA-Z]*$/.test(val);
    
    // Apply validation based on field name
    let validatedValue = value;
    
    switch (name) {
      case 'zipCode':
        if (!validateNumeric(value)) return; // Don't update if invalid
        validatedValue = value;
        break;
      case 'payRate':
        if (!validateDecimalNumber(value)) return; // Don't update if invalid
        validatedValue = value;
        break;
      case 'city':
        if (!validateLettersAndSpaces(value)) return; // Don't update if invalid
        validatedValue = value;
        break;
      case 'state':
        if (!validateLettersOnly(value)) return; // Don't update if invalid
        validatedValue = value.toUpperCase(); // Convert to uppercase for state
        break;
      default:
        validatedValue = value;
    }
    
    setJobData((prev) => ({
      ...prev,
      [name]: validatedValue,
    }));
  };

  const handleCreateJob = async (e: any) => {
    e.preventDefault();

    const fullJobData = {
      ...jobData,
      payRate: parseFloat(jobData.payRate) || 0, // Convert to number
      skills,
      tags,
      requirements,
      employerId: employer.id,
      company: employer.companyName, // Map companyName to company for backward compatibility
      companyName: employer.companyName, // Use the new field
      logo: employer.logo,
      jobImage: jobImage,
      status: "Active", // Set default status as active
      location: jobData.city, // Map city to location for jobModel
      benefits: [], // Initialize as empty array, can be expanded later
      schedule: jobData.type, // Use job type as schedule for now
      applyWebsite: "", // Initialize as empty, can be expanded later
      startDate: "", // Initialize as empty, can be expanded later
    };

    axiosInstance
      .post("/employerjobs/createjob", fullJobData)
      .then((response) => {
        // Save job to employer_data jobs array in localStorage after successful response
        const createdJob = {
          id: response.data.newJob.id,
          title: jobData.title,
          location: jobData.city,
          type: jobData.type,
          company: employer.companyName, // Keep for backward compatibility
          companyName: employer.companyName, // Use new field
          status: "Active",
          createdAt: new Date().toISOString(),
          ...fullJobData
        };
        
        // Get existing employer_data from localStorage
        const employerData = JSON.parse(localStorage.getItem('employer_data') || '{}');
        
        // Initialize jobs array if it doesn't exist
        if (!employerData.jobs) {
          employerData.jobs = [];
        }
        
        // Add new job to the jobs array
        employerData.jobs.unshift(createdJob);
        
        // Save updated employer_data back to localStorage
        localStorage.setItem('employer_data', JSON.stringify(employerData));
        
        navigate("/employer/jobsuccess", {
          state: {
            jobId: response.data.newJob.id,
            title: jobData.title,
            location: jobData.city,
            type: jobData.type,
          },
        });
      })
      .catch((error) => console.error(error));
  };

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");

  const handleAddTag = (e: any) => {
    e.preventDefault();
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: any) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addSuggestedTag = (tag: any) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement)) {
      setRequirements([...requirements, newRequirement]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (requirementToRemove: string) => {
    setRequirements(requirements.filter((req) => req !== requirementToRemove));
  };

  const handleJobImageSave = (file: File) => {
    setJobImage(file);
    const previewUrl = URL.createObjectURL(file);
    setJobImagePreview(previewUrl);
  };

  // Cleanup function for job image preview URL
  useEffect(() => {
    return () => {
      if (jobImagePreview) {
        URL.revokeObjectURL(jobImagePreview);
      }
    };
  }, [jobImagePreview]);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex items-center ml-5 justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
        <p className="text-sm text-gray-500">* Required fields</p>
      </div>

      <form
        onSubmit={handleCreateJob}
        className="bg-white rounded-xl shadow-sm p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <BriefcaseIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="title"
                value={jobData.title}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. Content Creator"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CheckCircleIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="type"
                value={jobData.type}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select Job Type</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
              </select>
            </div>
          </div>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address
          </label>
          <div className="relative">
            <HomeIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="address"
              value={jobData.address}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. 123 Main Street"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPinIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="city"
                value={jobData.city}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. New York"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="state"
                  value={jobData.state}
                  onChange={handleInputChange}
                  required
                  maxLength={2}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. NY"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code
              </label>
              <div className="relative">
                <HashIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="zipCode"
                  value={jobData.zipCode}
                  onChange={handleInputChange}
                  maxLength={5}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. 10001"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <BuildingIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <div className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="industry"
                value={jobData.industry}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select Industry </option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pay Rate <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSignIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="payRate"
                value={jobData.payRate}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. 15.50"
              />
            </div>
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pay Frequency <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CheckCircleIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="payFrequency"
                value={jobData.payFrequency}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select Frequency </option>
                <option value="One Time">Once</option>
                <option value="Gift Card">Gift Card</option>
                <option value="Per Hour">Per Hour</option>
                <option value="Per Day">Per Day</option>
                <option value="Per Week">Per Week</option>
                <option value="Per Month">Per Month</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FileTextIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[120px]"
              placeholder="Describe the role and responsibilities..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requirements
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter a requirement..."
              />
            </div>
            <button
              onClick={handleAddRequirement}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {requirements.map((requirement, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800"
              >
                {requirement}
                <button
                  onClick={() => removeRequirement(requirement)}
                  className="ml-2 text-teal-600 hover:text-teal-800"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Categories & Tags
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <TagIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(e);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Add a category or tag..."
                />
              </div>
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-teal-600 hover:text-teal-800"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

         {/*} <div className="mt-6 space-y-4">
            <p className="text-sm font-medium text-gray-700">Suggested Tags</p>
            {Object.entries(suggestedTags).map(([category, categoryTags]) => (
              <div key={category} className="space-y-2">
                <p className="text-sm text-gray-600">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {categoryTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => addSuggestedTag(tag)}
                      disabled={tags.includes(tag)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                        tags.includes(tag)
                          ? "bg-teal-100 text-teal-800 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                      }`}
                    >
                      {tag}
                      {!tags.includes(tag) && (
                        <PlusIcon className="w-4 h-4 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>*/}
        </div>

        {/* Job Image Upload Section */}
        <div className="border-t pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Job Image <span className="text-red-500">*</span>
          </label>
          <div className="flex items-start space-x-4">
            {jobImagePreview ? (
              <div className="relative">
                <img
                  src={jobImagePreview}
                  alt="Job preview"
                  className="w-64 h-48 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setJobImage(null);
                    setJobImagePreview(null);
                    if (jobImagePreview) {
                      URL.revokeObjectURL(jobImagePreview);
                    }
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-64 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <FileTextIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <button
                type="button"
                onClick={() => setIsImageModalOpen(true)}
                className="px-4 py-2 bg-teal-50 text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
              >
                {jobImage ? 'Change Image' : 'Upload Image'}
              </button>
              <p className="text-sm text-gray-500 mt-1">
                Upload an image to represent the job listing
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate("/employer")}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            <SaveIcon className="w-5 h-5 mr-2" />
            Create Job
          </button>
        </div>
      </form>

      {/* Job Image Upload Modal */}
      <UploadImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSave={handleJobImageSave}
        title="Upload Job Image"
      />
    </div>
  );
};

export default CreateJob;
