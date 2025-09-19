import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = searchParams.get("token");
    try {
      const response = await axios.post("/api/auth/reset-password", {
        token,
        newPassword,
      });
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
            Reset Your Password
          </h1>
          <p className="text-gray-600 text-lg">
            Enter your new password below to reset your account password.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
              />
            </div>

            <button className="w-full bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-500 transition-all duration-300 transform hover:scale-105">
              Reset Password
            </button>
          </form>

          {message && (
            <div className="mt-4 text-center text-teal-600">
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
