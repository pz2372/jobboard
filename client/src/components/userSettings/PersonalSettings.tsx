import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../axiosInstance";
import { RootState } from "../../redux/store";
import { setUserProfile } from "../../redux/profileSlice";

const PersonalSettings = ({ onBack }: any) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const userProfile = useSelector((state: RootState) => state.profile.userProfile);
    
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      phoneNumber: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // Initialize form data from Redux store
    useEffect(() => {
      if (user) {
        setFormData(prev => ({
          ...prev,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
        }));
      }
      if (userProfile) {
        setFormData(prev => ({
          ...prev,
          phoneNumber: userProfile.phoneNumber || "",
        }));
      }
    }, [user, userProfile]);

    const handleSubmit = async (e: any) => {
      e.preventDefault();
      
      if (!user?.id) {
        setMessage({ text: "User not found. Please log in again.", type: 'error' });
        return;
      }

      setIsLoading(true);
      setMessage(null);

      try {
        // Update the user profile with phone number
        const response = await axiosInstance.put(`/userprofile/${user.id}`, {
          phoneNumber: formData.phoneNumber,
        });

        if (response.data) {
          setMessage({ text: "Personal information updated successfully!", type: 'success' });
          
          // Update Redux store with the new profile data
          const updatedProfile = response.data.updatedProfile;
          if (updatedProfile) {
            dispatch(setUserProfile(updatedProfile));
            
            // Also update localStorage cache
            const now = new Date().getTime();
            localStorage.setItem("profileData", JSON.stringify(updatedProfile));
            localStorage.setItem("profileDataTimestamp", now.toString());
          }
        }
      } catch (error: any) {
        console.error("Error updating personal information:", error);
        const errorMessage = error.response?.data?.message || "Failed to update personal information. Please try again.";
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
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg bg-gray-100"
            value={formData.firstName}
            disabled
            title="First name cannot be changed here"
          />
          <p className="text-xs text-gray-500">Contact support to change your first name</p>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg bg-gray-100"
            value={formData.lastName}
            disabled
            title="Last name cannot be changed here"
          />
          <p className="text-xs text-gray-500">Contact support to change your last name</p>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                phoneNumber: e.target.value,
              })
            }
            disabled={isLoading}
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
          {isLoading ? "Updating..." : "Update Personal Information"}
        </button>
      </form>
    );
  };

  export default PersonalSettings