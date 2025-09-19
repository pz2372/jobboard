import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../axiosInstance';
import { RootState } from '../../redux/store';

const PasswordSettings = ({ onBack }: any) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!user?.id) {
      setMessage({ text: "User not found. Please log in again.", type: 'error' });
      return;
    }

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ text: "All fields are required.", type: 'error' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: "New passwords do not match.", type: 'error' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ text: "New password must be at least 6 characters long.", type: 'error' });
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setMessage({ text: "New password must be different from current password.", type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await axiosInstance.put(`/password/update-password/${user.id}`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.data) {
        setMessage({ text: "Password updated successfully!", type: 'success' });
        // Clear the form
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error: any) {
      console.error("Error updating password:", error);
      const errorMessage = error.response?.data?.message || "Failed to update password. Please try again.";
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Current Password
        </label>
        <input
          type="password"
          placeholder="Enter your current password"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          value={formData.currentPassword}
          onChange={(e) =>
            setFormData({
              ...formData,
              currentPassword: e.target.value,
            })
          }
          disabled={isLoading}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          placeholder="Enter your new password (min 6 characters)"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          value={formData.newPassword}
          onChange={(e) =>
            setFormData({
              ...formData,
              newPassword: e.target.value,
            })
          }
          disabled={isLoading}
          required
          minLength={6}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <input
          type="password"
          placeholder="Confirm your new password"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({
              ...formData,
              confirmPassword: e.target.value,
            })
          }
          disabled={isLoading}
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
          isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-teal-600 hover:bg-teal-700'
        }`}
      >
        {isLoading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
  };

  export default PasswordSettings