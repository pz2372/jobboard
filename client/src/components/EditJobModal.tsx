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
  EditIcon,
} from "lucide-react";
import { industries } from "components/Industries";
import axiosInstance from "axiosInstance";

interface EditJobModalProps {
  job: any;
  isOpen: boolean;
  onClose: () => void;
  onJobUpdated: (updatedJob: any) => void;
}

const EditJobModal: React.FC<EditJobModalProps> = ({
  job,
  isOpen,
  onClose,
  onJobUpdated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [jobData, setJobData] = useState({
    title: "",
    type: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    industry: "",
    description: "",
    payRate: "",
    payFrequency: "",
  });

  // Initialize form data when job prop changes
  useEffect(() => {
    if (job) {
      setJobData({
        title: job.title || "",
        type: job.type || "",
        address: job.address || "",
        city: job.city || "",
        state: job.state || "",
        zipCode: job.zipCode || "",
        industry: job.industry || "",
        description: job.description || "",
        payRate: job.payRate || "",
        payFrequency: job.payFrequency || "",
      });

      // Parse requirements if they exist
      if (job.requirements) {
        const parsedRequirements = 
          typeof job.requirements === "string"
            ? job.requirements.replace(/[{}]/g, "").split(/",\s*"/).map(req => req.replace(/"/g, ''))
            : Array.isArray(job.requirements) 
            ? job.requirements 
            : [];
        setRequirements(parsedRequirements);
      } else {
        setRequirements([]);
      }

      // Parse tags if they exist
      if (job.tags) {
        const parsedTags = 
          typeof job.tags === "string"
            ? job.tags.replace(/[{}]/g, "").split(/",\s*"/).map(tag => tag.replace(/"/g, ''))
            : Array.isArray(job.tags) 
            ? job.tags 
            : [];
        setTags(parsedTags);
      } else {
        setTags([]);
      }
    }
  }, [job]);

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
        if (!validateNumeric(value)) return;
        validatedValue = value;
        break;
      case 'payRate':
        if (!validateDecimalNumber(value)) return;
        validatedValue = value;
        break;
      case 'city':
        if (!validateLettersAndSpaces(value)) return;
        validatedValue = value;
        break;
      case 'state':
        if (!validateLettersOnly(value)) return;
        validatedValue = value.toUpperCase();
        break;
      default:
        validatedValue = value;
    }
    
    setJobData((prev) => ({
      ...prev,
      [name]: validatedValue,
    }));
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

  const handleUpdateJob = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const fullJobData = {
      ...jobData,
      payRate: parseFloat(jobData.payRate) || 0, // Convert to number
      tags,
      requirements,
    };

    try {
      console.log("Updating job ID:", job.id);
      console.log("Updating job with data:", fullJobData); // Debug log
      console.log("API endpoint:", `/employerjobs/${job.id}`);
      
      const response = await axiosInstance.put(`/employerjobs/${job.id}`, fullJobData);
      console.log("Update response status:", response.status);
      console.log("Update response data:", response.data); // Debug log
      
      // Update localStorage employer_data jobs array
      const employerData = JSON.parse(localStorage.getItem('employer_data') || '{}');
      if (employerData.jobs && Array.isArray(employerData.jobs)) {
        const jobIndex = employerData.jobs.findIndex(j => j.id === job.id);
        if (jobIndex !== -1) {
          // Update the job in localStorage with the updated data
          employerData.jobs[jobIndex] = {
            ...employerData.jobs[jobIndex],
            ...fullJobData,
            updatedAt: new Date().toISOString()
          };
          localStorage.setItem('employer_data', JSON.stringify(employerData));
          console.log("Updated job in localStorage");
        } else {
          console.log("Job not found in localStorage jobs array");
        }
      } else {
        console.log("No jobs array found in localStorage employer_data");
      }
      
      onJobUpdated(response.data.job);
      onClose();
    } catch (error) {
      console.error("Error updating job:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <EditIcon className="w-6 h-6 text-teal-600" />
              Edit {job?.title || 'Job'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleUpdateJob} className="p-6 space-y-6">
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
                  placeholder="e.g. New York (letters only)"
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
                    placeholder="e.g. NY (letters only)"
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
                    placeholder="e.g. 10001 (numbers only)"
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
                <select
                  name="industry"
                  value={jobData.industry}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Industry</option>
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
                  placeholder="e.g. 15.50 (numbers only)"
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
                  <option value="">Select Frequency</option>
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
                type="button"
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
                    type="button"
                    onClick={() => removeRequirement(requirement)}
                    className="ml-2 text-teal-600 hover:text-teal-800"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Add a category or tag..."
                  />
                </div>
                <button
                  type="button"
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
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-teal-600 hover:text-teal-800"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 disabled:opacity-50"
            >
              <SaveIcon className="w-5 h-5 mr-2" />
              {isLoading ? "Updating..." : "Update Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobModal;
