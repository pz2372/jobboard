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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const EmployerSignup = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
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
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "confirmPassword" || name === "password") {
      if (name === "confirmPassword" && value !== formData.password) {
        setPasswordError("Passwords do not match");
      } else if (name === "password" && value !== formData.confirmPassword) {
        setPasswordError("Passwords do not match");
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
      !formData.phone
    ) {
      setValidationError("Please fill in all required fields");
      return false;
    }
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      setValidationError("Please enter a valid phone number");
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
      const response = await fetch("https://api.example.com/employer/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
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
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {step === 1 ? (
                  <div className="grid grid-cols-1 gap-6">
                    <div className="relative">
                      <BuildingIcon className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
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
                      <MailIcon className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
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
                      <LockIcon className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
                      />
                    </div>

                    <div className="relative">
                      <LockIcon className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
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
                    <div className="relative">
                      <MapPinIcon className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
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
                        <MapPinIcon className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
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
                        <MapPinIcon className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="State"
                          className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <PhoneIcon className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
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
                      <GlobeIcon className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
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
                      <HashIcon className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
                      <input
                        type="text"
                        name="taxNumber"
                        value={formData.taxNumber}
                        onChange={handleInputChange}
                        placeholder="EIN/Tax Number"
                        className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
                      />
                    </div>
                  </div>
                )}

                {passwordError && (
                  <p className="text-red-500 text-sm">{passwordError}</p>
                )}
                {validationError && (
                  <p className="text-red-500 text-sm">{validationError}</p>
                )}
                {submissionError && (
                  <p className="text-red-500 text-sm">{submissionError}</p>
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
    </main>
  );
};

export default EmployerSignup;
