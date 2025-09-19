import React, { useState } from "react";
import axios from "axios";
import {
  MailIcon,
  ArrowLeftIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-teal-600 font-comic tracking-wide">
            Reset Password
          </h1>
          <p className="text-gray-600 text-lg">
            Enter your email address and we'll send you instructions to reset
            your password
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <MailIcon className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
              />
            </div>

            <button className="w-full bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-500 transition-all duration-300 transform hover:scale-105">
              Send Reset Instructions
            </button>
          </form>

          {message && (
            <div className="mt-4 text-center text-teal-600">
              {message}
            </div>
          )}

          <div className="mt-8 text-center">
            <button 
              type="button"
              onClick={() => navigate('/login')} 
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-500 font-medium transition-all duration-300 hover:gap-3 bg-transparent border-none cursor-pointer"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;