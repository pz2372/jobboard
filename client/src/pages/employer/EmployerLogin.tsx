import React, { useState } from "react";
import { UserCircle, BriefcaseIcon, LockIcon, MailIcon } from "lucide-react";

const EmployerLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [validationError, setValidationError] = useState("");
  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setValidationError("");
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setValidationError("Please fill in all required fields");
      return;
    }
    // Handle login logic here
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-teal-600 font-comic tracking-wide">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-lg">
            Sign in to access your employer account
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
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
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-teal-600 border-2 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a className="text-teal-600 hover:text-teal-500 font-medium">
                Forgot password?
              </a>
            </div>

            {validationError && (
              <p className="text-red-500 text-sm">{validationError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-500 transition-all duration-300 transform hover:scale-105 text-lg font-medium"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a className="text-teal-600 hover:text-teal-500 font-medium">
                Register now
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmployerLogin;
