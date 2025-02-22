import React, { useState } from "react";
import {
  PlusIcon,
  BuildingIcon,
  BriefcaseIcon,
  MapPinIcon,
  DollarSignIcon,
  GraduationCapIcon,
  FileTextIcon,
  ListChecksIcon,
  TagIcon,
  SaveIcon,
  XIcon,
  HomeIcon,
  MapIcon,
  HashIcon,
  CheckCircleIcon,
} from "lucide-react";
import { industries } from "components/Industries";
import { suggestedSkills } from "components/SuggestedSkills";
import { suggestedTags } from "components/SuggestedTags";
import { useNavigate } from "react-router-dom";
import axiosInstance from "axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";

const CreateJob = () => {
  const employer = useSelector(
    (state: RootState) => state.employerAuth.employer
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState<string>("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");
  const navigate = useNavigate();
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
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateJob = async (e: any) => {
    e.preventDefault();

    const fullJobData = {
      ...jobData,
      skills,
      tags,
      requirements,
      employerId: employer.id,
      companyName: employer.companyName,
      logo: employer.logo,
    };

    axiosInstance
      .post("/employerjob/createjob", fullJobData)
      .then((response) => {
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/employer/jobsuccess", {
            state: {
              jobId: response.data,
              title: jobData.title,
              location: jobData.city,
              type: jobData.type,
            },
          });
        }, 2000);
      })
      .catch((error) => console.error(error));
  };

  const handleAddSkill = (e: any) => {
    e.preventDefault();
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: any) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const addSuggestedSkill = (skill: any) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
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

  return (
    <div className="max-w-4xl mx-auto mt-16">
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
                placeholder="e.g. Senior Frontend Developer"
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
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
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
              name="streetAddress"
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. 10001"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <div className="relative">
              <GraduationCapIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="experienceLevel"
                value={jobData.experienceLevel}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select Level</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="lead">Lead</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hourly Wage Range <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <DollarSignIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                name="minWage"
                value={jobData.minWage}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Min/hour"
              />
            </div>
            <div className="relative flex-1">
              <DollarSignIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                name="maxWage"
                value={jobData.maxWage}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Max/hour"
              />
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

          <div className="mt-6 space-y-4">
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
            Save Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
