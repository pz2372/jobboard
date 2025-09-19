import React, { useState } from "react";
import {
  UserCircle,
  BriefcaseIcon,
  LockIcon,
  MailIcon,
  BuildingIcon,
  PhoneIcon,
  GlobeIcon,
  MapPinIcon,
  HashIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  Loader2Icon,
  CheckCircleIcon,
  Upload,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "axiosInstance";
import { useDispatch } from "react-redux";
import { employerSignup } from "../../redux/employerAuthSlice";
import type { AppDispatch } from "../../redux/store";
import UploadImageModal from "../../components/UploadImageModal";

const EmployerSignup = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    taxNumber: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    capital: false,
    symbol: false,
  });
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      capital: /[A-Z]/.test(password),
      symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
    setPasswordRequirements(requirements);
    
    const isValid = requirements.length && requirements.capital && requirements.symbol;
    return isValid;
  };

  // Validation functions for different field types
  const isLettersOnly = (value: string): boolean => {
    return /^[a-zA-Z\s]*$/.test(value);
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limitedDigits = digits.slice(0, 10);
    
    // Format based on length
    if (limitedDigits.length <= 3) {
      return limitedDigits;
    } else if (limitedDigits.length <= 6) {
      return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`;
    } else {
      return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`;
    }
  };

  const handleLogoUpload = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setCompanyLogo(reader.result);
      }
    };
    reader.readAsDataURL(file);
    setUploadModalOpen(false);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Apply specific validation and formatting based on field type
    if (name === "city" && !isLettersOnly(value)) {
      return; // Don't update if non-letters entered
    }
    
    if (name === "state") {
      if (!isLettersOnly(value)) return; // Don't update if non-letters entered
      processedValue = value.toUpperCase().slice(0, 2); // Auto-capitalize and limit to 2 characters
    }
    
    if (name === "phone") {
      processedValue = formatPhoneNumber(value);
    }
    
    if (name === "taxNumber") {
      // Only allow numbers and limit to 9 digits
      const digits = value.replace(/\D/g, '');
      processedValue = digits.slice(0, 9);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
    
    if (name === "password") {
      const isValidPassword = validatePassword(processedValue);
      if (processedValue && !isValidPassword) {
        setPasswordError("Password does not meet requirements");
      } else {
        setPasswordError("");
      }
      
      // Check confirm password match if it exists
      if (formData.confirmPassword && processedValue !== formData.confirmPassword) {
        setPasswordError("Passwords do not match");
      }
    }
    
    if (name === "confirmPassword") {
      if (processedValue !== formData.password) {
        setPasswordError("Passwords do not match");
      } else if (formData.password && !validatePassword(formData.password)) {
        setPasswordError("Password does not meet requirements");
      } else {
        setPasswordError("");
      }
    }
    
    setValidationError("");
    setSubmissionError("");
  };

  const validateStep1 = () => {
    if (
      !formData.companyName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setValidationError("Please fill in all required fields");
      return false;
    }
    if (passwordError) return false;
    if (!validatePassword(formData.password)) {
      setValidationError("Password must meet all requirements");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setValidationError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.phone ||
      !companyLogo
    ) {
      setValidationError("Please fill in all required fields and upload a company logo");
      return false;
    }
    if (formData.phone && !/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.phone)) {
      setValidationError("Please enter a complete 10-digit phone number");
      return false;
    }
    if (formData.website && !/^https?:\/\/.*/.test(formData.website)) {
      setValidationError(
        "Please enter a valid website URL starting with http:// or https://"
      );
      return false;
    }
    if (formData.taxNumber && !/^[0-9]{9}$/.test(formData.taxNumber)) {
      setValidationError("Please enter a valid 9-digit EIN number");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setValidationError("");
    setSubmissionError("");
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setIsLoading(true);
    setSubmissionError("");
    try {
      dispatch(employerSignup(formData))
        .unwrap()
        .then(() => {
          navigate("/employer");
        });
      setIsSuccess(true);
    } catch (error) {
      setSubmissionError(
        "An error occurred during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-teal-600 font-comic tracking-wide">
            Employer Registration
          </h1>
          <p className="text-gray-600 text-lg">
            Create your employer account to start posting jobs and finding
            talent
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-12 text-center">
            <CheckCircleIcon className="w-16 h-16 text-teal-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-teal-600 mb-4">
              Registration Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your employer account has been created successfully.
            </p>
            <a
              href="/login"
              className="inline-block bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-500 transition-all duration-300"
            >
              Proceed to Login
            </a>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-12">
            {passwordError && (
                  <p className="font-bold text-red-600 pb-5 text-center">{passwordError}</p>
                )}
                {validationError && (
                  <p className="font-bold text-red-600 pb-5 text-center">{validationError}</p>
                )}
                {submissionError && (
                  <p className="font-bold text-red-600 pb-5 text-center">{submissionError}</p>
                )}
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {step === 1 ? (
                  <div className="grid grid-cols-1 gap-6">
                    <div className="relative">
                      <BuildingIcon className="absolute left-4 top-4 text-teal-600 w-5 h-5" />
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Company Name"
                        className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
                      />
                    </div>

                    <div className="relative">
                      <MailIcon className="absolute left-4 top-4 text-teal-600 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Business Email"
                        className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
                      />
                    </div>

                    <div className="relative">
                      <LockIcon className="absolute left-4 top-4 text-teal-600 w-5 h-5" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
                      />
                    </div>

                    {formData.password && (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                        <div className="space-y-1">
                          <div className={`flex items-center gap-2 text-sm ${passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}`}>
                            <CheckCircleIcon className={`w-4 h-4 ${passwordRequirements.length ? 'text-green-600' : 'text-gray-400'}`} />
                            At least 8 characters
                          </div>
                          <div className={`flex items-center gap-2 text-sm ${passwordRequirements.capital ? 'text-green-600' : 'text-gray-500'}`}>
                            <CheckCircleIcon className={`w-4 h-4 ${passwordRequirements.capital ? 'text-green-600' : 'text-gray-400'}`} />
                            At least one capital letter
                          </div>
                          <div className={`flex items-center gap-2 text-sm ${passwordRequirements.symbol ? 'text-green-600' : 'text-gray-500'}`}>
                            <CheckCircleIcon className={`w-4 h-4 ${passwordRequirements.symbol ? 'text-green-600' : 'text-gray-400'}`} />
                            At least one symbol (!@#$%^&*)
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="relative">
                      <LockIcon className="absolute left-4 top-4 text-teal-600 w-5 h-5" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm Password"
                        className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {/* Company Logo Upload */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-teal-300 transition-colors">
                          {companyLogo ? (
                            <img
                              src={companyLogo}
                              alt="Company Logo"
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <BuildingIcon className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadModalOpen(true)}
                          className="absolute bottom-0 right-0 bg-teal-600 p-2 rounded-full shadow-lg hover:bg-teal-700 transition-colors"
                        >
                          <Upload className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 text-center">
                        Upload your company logo
                      </p>
                    </div>

                    <div className="relative">
                      <MapPinIcon className="absolute left-4 top-4 text-teal-600 w-5 h-5" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Street Address"
                        className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <MapPinIcon className="absolute left-4 top-4 text-teal-600 w-5 h-5" />
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
                        />
                      </div>

                      <div className="relative">
                        <MapPinIcon className="absolute left-4 top-4 text-teal-600 w-5 h-5" />
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="State"
                          maxLength={2}
                          className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <PhoneIcon className="absolute left-4 top-4 text-teal-600 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
                      />
                    </div>

                    <div className="relative">
                      <GlobeIcon className="absolute left-4 top-4 text-teal-600 w-5 h-5" />
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="Company Website"
                        className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
                      />
                    </div>

                    <div className="relative">
                      <HashIcon className="absolute left-4 top-4 text-teal-600 w-5 h-5" />
                      <input
                        type="text"
                        name="taxNumber"
                        value={formData.taxNumber}
                        onChange={handleInputChange}
                        placeholder="EIN/Tax Number"
                        maxLength={9}
                        className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between gap-4">
                  {step === 2 && (
                    <button
                      onClick={handleBack}
                      disabled={isLoading}
                      className="flex-1 bg-gray-100 text-gray-600 px-8 py-3 rounded-full hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 text-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <ArrowLeftIcon className="w-5 h-5" />
                      Back
                    </button>
                  )}
                  {step === 1 ? (
                    <button
                      onClick={handleNext}
                      disabled={passwordError ? true : false}
                      className="flex-1 bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-500 transition-all duration-300 transform hover:scale-105 text-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      Next
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="flex-1 bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-500 transition-all duration-300 transform hover:scale-105 text-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2Icon className="w-5 h-5 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to={"/employer/login"}
                    className="text-teal-600 hover:text-teal-500 font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      
      <UploadImageModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSave={handleLogoUpload}
      />
    </main>
  );
};

export default EmployerSignup;
