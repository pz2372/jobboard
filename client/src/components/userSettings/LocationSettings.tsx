import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../axiosInstance";
import { RootState } from "../../redux/store";
import { setUserProfile } from "../../redux/profileSlice";

const LocationSettings = ({ onBack }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const userProfile = useSelector((state: RootState) => state.profile.userProfile);
  const [formData, setFormData] = useState({
    city: "",
    state: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Initialize form data from Redux store
  useEffect(() => {
    if (userProfile) {
      setFormData({
        city: userProfile.city || "",
        state: userProfile.state || "",
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!user?.id) {
      setMessage({ text: "User not found. Please log in again.", type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await axiosInstance.put(`/userprofile/${user.id}`, {
        state: formData.state,
        city: formData.city,
      });

      if (response.data) {
        setMessage({ text: "Location updated successfully!", type: 'success' });
        
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
      console.error("Error updating location:", error);
      const errorMessage = error.response?.data?.message || "Failed to update location. Please try again.";
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
        <label className="block text-sm font-medium text-gray-700">City</label>
        <input
          type="text"
          placeholder="Enter your city"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          value={formData.city}
          onChange={(e) =>
            setFormData({
              ...formData,
              city: e.target.value,
            })
          }
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          State
        </label>
        <input
          type="text"
          placeholder="Enter your state"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          value={formData.state}
          onChange={(e) =>
            setFormData({
              ...formData,
              state: e.target.value,
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
        {isLoading ? "Updating..." : "Update Location"}
      </button>
    </form>
  );
};

export default LocationSettings;
