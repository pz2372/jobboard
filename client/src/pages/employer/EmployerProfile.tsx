import React, { useState, useEffect } from "react";
import {
  Building2,
  Settings,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  X,
  Upload,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "redux/store";
import { useNavigate } from "react-router-dom";
import axiosInstance from "axiosInstance";
import UploadImageModal from "../../components/UploadImageModal";
import { setEmployer } from "../../redux/employerAuthSlice";

type companyInfo = {
  companyName: string;
  address: string;
  city: string;
  state: string;
  website: string;
  description: string;
  email: string;
  phoneNumber: string;
};

const EmployerProfile = () => {
  const employer = useSelector(
    (state: RootState) => state.employerAuth.employer
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [originalInfo, setOriginalInfo] = useState<companyInfo>({
    companyName: "",
    address: "",
    city: "",
    state: "",
    website: "",
    description: "",
    email: "",
    phoneNumber: "",
  });
  const [companyInfo, setCompanyInfo] = useState<companyInfo>({
    companyName: "",
    address: "",
    city: "",
    state: "",
    website: "",
    description: "",
    email: "",
    phoneNumber: "",
  });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Update company info when employer data becomes available
  useEffect(() => {
    if (employer) {
      const employerInfo = {
        companyName: employer.companyName || "",
        address: employer.address || "",
        city: employer.city || "",
        state: employer.state || "",
        website: employer.website || "",
        description: employer.description || "",
        email: employer.email || "",
        phoneNumber: employer.phoneNumber || "",
      };
      setCompanyInfo(employerInfo);
      setOriginalInfo(employerInfo);
    }
  }, [employer]);

  // Redirect to login if employer data doesn't load within 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!employer) {
        console.log("No employer data found, redirecting to login");
        navigate("/employer/login");
      }
    }, 3000);

    // Clear timeout if employer data loads
    if (employer) {
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [employer, navigate]);

  const handleEdit = () => {
    setOriginalInfo(companyInfo);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setCompanyInfo(originalInfo);
    setIsEditing(false);
  };

  const handleSave = () => {
    // Validate phone number has exactly 10 digits
    const phoneDigits = companyInfo.phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      alert('Phone number must be exactly 10 digits');
      return;
    }

    // Validate state is exactly 2 letters
    if (companyInfo.state.length !== 2) {
      alert('State must be exactly 2 letters (e.g., CA, NY, TX)');
      return;
    }

    // Validate website has valid ending
    const validWebsiteEndings = ['.com', '.org', '.net', '.edu', '.gov', '.co', '.io'];
    const hasValidEnding = validWebsiteEndings.some(ending => 
      companyInfo.website.toLowerCase().endsWith(ending)
    );
    if (companyInfo.website && !hasValidEnding) {
      alert('Website must end with a valid domain (.com, .org, .net, .edu, .gov, .co, .io)');
      return;
    }

    setIsEditing(false);

    axiosInstance
      .put(`/employer/update/${employer.id}`, companyInfo)
      .then((response) => {
        console.log("Profile updated successfully:", response.data);
        
        // Update Redux state immediately with the new changes
        const updatedEmployer = {
          ...employer,
          ...companyInfo
        };
        dispatch(setEmployer(updatedEmployer));
        
        console.log("Updated employer data saved to Redux state");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        // Revert to original info on error
        setCompanyInfo(originalInfo);
      });
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Apply formatting based on length
    if (phoneNumber.length < 4) {
      return phoneNumber;
    } else if (phoneNumber.length < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setCompanyInfo({ ...companyInfo, phoneNumber: formattedPhone });
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow letters, automatically capitalize, max 2 characters
    const value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2);
    setCompanyInfo({ ...companyInfo, state: value });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow letters and spaces, capitalize first letter of each word
    const value = e.target.value
      .replace(/[^a-zA-Z\s]/g, '')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    setCompanyInfo({ ...companyInfo, city: value });
  };

  const handleImageSave = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('logo', file);

      const response = await axiosInstance.put(`/employer/updateLogo/${employer.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.employer) {
        // Update Redux state with the new logo
        const updatedEmployer = {
          ...employer,
          logo: response.data.employer.logo
        };
        dispatch(setEmployer(updatedEmployer));
        
        console.log("Logo uploaded and Redux state updated");
        
        // Refresh the page to ensure UI reflects the change
        window.location.reload();
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Failed to upload logo. Please try again.");
    }
  };

  if (!employer) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employer profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto h-[70vh] bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 rounded-3xl relative overflow-hidden shadow-2xl">
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5"></div>

        {/* Settings Button */}
        <div className="absolute top-8 right-8 z-20">
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-gray-700 transition-all duration-300 hover:bg-white/30"
              >
                <X size={24} />
              </button>
              <button
                onClick={handleSave}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-gray-700 transition-all duration-300 hover:bg-white/30"
              >
                <Save size={24} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleEdit}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white/30 transition-colors"
            >
              <Settings size={24} />
            </button>
          )}
        </div>

        {/* Company Name Overlay */}
        <div className="absolute top-0 left-0 right-0 bottom-56 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {employer.logo ? (
                <img
                  src={employer.logo}
                  alt="Company Logo"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shadow-lg border-2 border-white/30"
                />
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/20 backdrop-blur-sm shadow-lg border-2 border-white/30 flex items-center justify-center">
                  <Building2 size={32} className="text-white/80" />
                </div>
              )}
              {isEditing && (
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="absolute bottom-0 right-0 bg-teal-600 text-white p-1 rounded-full hover:bg-teal-700 transition-colors"
                >
                  <Upload size={16} />
                </button>
              )}
            </div>
            {isEditing ? (
              <div className="flex flex-col items-center gap-2">
                <input
                  type="text"
                  value={companyInfo.companyName}
                  onChange={(e) =>
                    setCompanyInfo({ ...companyInfo, companyName: e.target.value })
                  }
                  className="text-6xl md:text-8xl font-bold text-white bg-transparent border-b-2 border-white/50 focus:border-white focus:outline-none text-center"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
                />
                <textarea
                  value={companyInfo.description}
                  onChange={(e) =>
                    setCompanyInfo({ ...companyInfo, description: e.target.value })
                  }
                  className="w-full max-w-2xl bg-white/20 text-gray-700 placeholder-gray-600 rounded-lg p-3 border border-white/30 focus:border-white/50 focus:outline-none resize-none text-center"
                  rows={3}
                  placeholder="Company description..."
                />
              </div>
            ) : (
              <div className="text-center">
                <h1
                  className="text-6xl md:text-8xl font-bold text-white"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
                >
                  {companyInfo.companyName}
                </h1>
                <p className="text-gray-700 text-xl leading-relaxed max-w-2xl mx-auto mt-4">
                  {companyInfo.description}
                </p>
              </div>
            )}
          </div>
        </div>
        <UploadImageModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSave={handleImageSave}
        />
        {/* Company Details Card */}
        <div className="absolute bottom-8 left-8 right-8 z-10">
          <div className="bg-gradient-to-br from-amber-50/60 via-orange-50/65 to-yellow-50/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl h-[200px] border border-amber-100/25 relative overflow-hidden">
            {/* Reflective overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 to-transparent opacity-35 pointer-events-none"></div>
            <div className="relative z-10 h-full">
              <div className="flex gap-4 md:gap-8 h-full">
                {/* Contact Information */}
                <div className="flex-1">
                  <div className="flex flex-col justify-between h-full space-y-4">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Globe size={20} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={companyInfo.website}
                          onChange={(e) =>
                            setCompanyInfo({ ...companyInfo, website: e.target.value })
                          }
                          className="bg-white/20 text-gray-700 placeholder-gray-600 rounded px-3 py-1.5 border border-white/30 focus:border-white/50 focus:outline-none text-sm"
                          placeholder="Website"
                        />
                      ) : (
                        <span className="text-lg">{companyInfo.website}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone size={20} />
                      {isEditing ? (
                        <input
                          type="tel"
                          value={companyInfo.phoneNumber}
                          onChange={handlePhoneChange}
                          className="bg-white/20 text-gray-700 placeholder-gray-600 rounded px-3 py-1.5 border border-white/30 focus:border-white/50 focus:outline-none text-sm"
                          maxLength={14}
                        />
                      ) : (
                        <span className="text-lg">{companyInfo.phoneNumber}</span>
                      )}
                    </div>

                    <div className="flex items-start gap-3 text-gray-700">
                      <MapPin size={20} className="w-5 h-5 flex-shrink-0 mt-1" />
                      {isEditing ? (
                        <div className="flex flex-col gap-1 w-full">
                          <input
                            type="text"
                            value={companyInfo.address}
                            onChange={(e) =>
                              setCompanyInfo({ ...companyInfo, address: e.target.value })
                            }
                            className="bg-white/20 text-gray-700 placeholder-gray-600 rounded px-3 py-1.5 border border-white/30 focus:border-white/50 focus:outline-none w-full text-sm"
                            placeholder="Address"
                          />
                          <div className="flex gap-1">
                            <input
                              type="text"
                              value={companyInfo.city}
                              onChange={handleCityChange}
                              className="bg-white/20 text-gray-700 placeholder-gray-600 rounded px-3 py-1.5 border border-white/30 focus:border-white/50 focus:outline-none flex-1 text-sm"
                              placeholder="City"
                            />
                            <input
                              type="text"
                              value={companyInfo.state}
                              onChange={handleStateChange}
                              className="bg-white/20 text-gray-700 placeholder-gray-600 rounded px-3 py-1.5 border border-white/30 focus:border-white/50 focus:outline-none flex-1 text-sm"
                              placeholder="State"
                              maxLength={2}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-lg">
                          <div>{companyInfo.address}</div>
                          <div>{companyInfo.city}, {companyInfo.state}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
