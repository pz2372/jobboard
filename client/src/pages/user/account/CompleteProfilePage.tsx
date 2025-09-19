import React, { useState, useEffect } from "react";
import {
  UserCircle,
  MapPinIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  PhoneIcon,
  MailIcon,
  ChevronRightIcon,
  CameraIcon,
  TrophyIcon,
  HeartIcon,
  UsersIcon,
  StarIcon,
  PlusIcon,
  XIcon,
  User,
  Upload,
  Instagram,
  Video,
  PlayCircle,
} from "lucide-react";
import profileSuggestions from "components/ProfileSuggestions";
import UploadImageModal from "components/UploadImageModal";
import axiosInstance from "axiosInstance";
import { RootState } from "redux/store";
import { useSelector } from "react-redux";
import SuggestionBubble from "components/SuggestionBubble";
import SelectedItem from "components/SelectedItem";
import { useNavigate } from "react-router-dom";

type Category =
  | "extracurriculars"
  | "clubs"
  | "hobbies"
  | "awards"
  | "volunteer";

interface InputValues {
  [key: string]: string;
}

const CompleteProfilePage = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [education, setEducation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedExtracurriculars, setSelectedExtracurriculars] = useState<
    string[]
  >([]);
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [selectedAwards, setSelectedAwards] = useState<string[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState<string[]>([]);
  const [inputValues, setInputValues] = useState<InputValues>({
    extracurriculars: "",
    clubs: "",
    hobbies: "",
    awards: "",
    volunteer: "",
  });
  
  // Social Media and Videos state
  const [portfolioVideos, setPortfolioVideos] = useState<File[]>([]);
  const [videoUploadModalOpen, setVideoUploadModalOpen] = useState(false);
  
  // Social Media Accounts state (like SocialMediaSection)
  const [socialMediaAccounts, setSocialMediaAccounts] = useState([
    {
      id: 1,
      platform: "instagram",
      handle: "@yourhandle",
      followers: 0,
      profileUrl: "https://instagram.com/yourhandle"
    },
    {
      id: 2,
      platform: "tiktok", 
      handle: "@yourhandle",
      followers: 0,
      profileUrl: "https://tiktok.com/@yourhandle"
    }
  ]);
  const [instagramModalOpen, setInstagramModalOpen] = useState(false);
  
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Validation functions
  const isLettersOnly = (value: string): boolean => {
    return /^[a-zA-Z\s]*$/.test(value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isLettersOnly(value)) {
      setCity(value);
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (isLettersOnly(value) && value.length <= 2) {
      setState(value);
    }
  };

  const handleCurrentPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isLettersOnly(value)) {
      setCurrentPosition(value);
    }
  };

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isLettersOnly(value)) {
      setEducation(value);
    }
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

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatPhoneNumber(value);
    setPhoneNumber(formattedValue);
  };

  const handleVideoUpload = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles = Array.from(files).filter(file => {
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB limit
      return isVideo && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setError('Some files were not added. Please upload only video files under 100MB.');
    }

    setPortfolioVideos(prev => [...prev, ...validFiles]);
    setVideoUploadModalOpen(false);
  };

  // Create object URLs for video preview
  const getVideoUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  // Cleanup object URLs when component unmounts or videos change
  React.useEffect(() => {
    return () => {
      portfolioVideos.forEach(video => {
        if (video instanceof File) {
          URL.revokeObjectURL(getVideoUrl(video));
        }
      });
    };
  }, [portfolioVideos]);

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleInstagramConnect = (handle: string, followers: number) => {
    setSocialMediaAccounts(prev => 
      prev.map(account => 
        account.platform === "instagram" 
          ? { ...account, handle, followers, profileUrl: `https://instagram.com/${handle.replace('@', '')}` }
          : account
      )
    );
    setInstagramModalOpen(false);
  };

  const handleTikTokConnect = () => {
    // TODO: Implement TikTok OAuth later
    console.log("TikTok OAuth will be implemented later");
  };

  const handleAdd = (
    item: string,
    category: Category,
    isManualInput = false
  ) => {
    let newItem = isManualInput ? inputValues[category] : item;
    if (!newItem.trim()) return;
    const updateState = {
      extracurriculars: setSelectedExtracurriculars,
      clubs: setSelectedClubs,
      hobbies: setSelectedHobbies,
      awards: setSelectedAwards,
      volunteer: setSelectedVolunteer,
    };
    const currentState = {
      extracurriculars: selectedExtracurriculars,
      clubs: selectedClubs,
      hobbies: selectedHobbies,
      awards: selectedAwards,
      volunteer: selectedVolunteer,
    };
    if (!currentState[category].includes(newItem)) {
      updateState[category]([...currentState[category], newItem]);
    }
    setInputValues({
      ...inputValues,
      [category]: "",
    });
  };

  const handleRemove = (item: string, category: Category) => {
    const updateState = {
      extracurriculars: setSelectedExtracurriculars,
      clubs: setSelectedClubs,
      hobbies: setSelectedHobbies,
      awards: setSelectedAwards,
      volunteer: setSelectedVolunteer,
    };
    const currentState = {
      extracurriculars: selectedExtracurriculars,
      clubs: selectedClubs,
      hobbies: selectedHobbies,
      awards: selectedAwards,
      volunteer: selectedVolunteer,
    };
    updateState[category](currentState[category].filter((i) => i !== item));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    category: Category
  ) => {
    setInputValues({
      ...inputValues,
      [category]: e.target.value,
    });
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    category: Category
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd("", category, true);
    }
  };

  const handleSaveProfilePicture = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
      }
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);

    axiosInstance
      .post(`/userprofile/picture/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Profile picture uploaded successfully", response);
      })
      .catch((error) => {
        console.error("Error uploading profile picture", error);
      });
  };

  const handleNextButton = () => {
    // Validation for step 1 - require profile image and bio
    if (step === 1) {
      if (!profileImage) {
        setError('Please upload a profile picture before continuing.');
        return;
      }
      if (!bio.trim()) {
        setError('Please enter a bio before continuing.');
        return;
      }
      // Clear error if validation passes
      setError('');
    }
    
    // Validation for step 2 - require all fields
    if (step === 2) {
      if (!city.trim()) {
        setError('Please enter your city before continuing.');
        return;
      }
      if (!state.trim()) {
        setError('Please enter your state before continuing.');
        return;
      }
      if (!currentPosition.trim()) {
        setError('Please enter your current position before continuing.');
        return;
      }
      if (!education.trim()) {
        setError('Please enter your education before continuing.');
        return;
      }
      if (!phoneNumber.trim()) {
        setError('Please enter your phone number before continuing.');
        return;
      }
      // Clear error if validation passes
      setError('');
    }
    
    setStep(step + 1)
  }

  const renderInput = (
    category: Category,
    icon: React.ReactNode,
    placeholder: string
  ) => {
    const selectedItems = {
      extracurriculars: selectedExtracurriculars,
      clubs: selectedClubs,
      hobbies: selectedHobbies,
      awards: selectedAwards,
      volunteer: selectedVolunteer,
    };
    const categorySelectedItems = selectedItems[category] || [];

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-4 rounded-full border border-gray-200 bg-white hover:border-teal-300 transition-colors">
          {icon}
          <input
            type="text"
            className="flex-1 border-none focus:outline-none bg-transparent text-teal-600 placeholder-gray-400"
            placeholder={placeholder}
            value={inputValues[category]}
            onChange={(e) => handleInputChange(e, category)}
            onKeyPress={(e) => handleKeyPress(e, category)}
          />
        </div>
        <div className="flex flex-wrap gap-2 pl-12">
          {categorySelectedItems.map((item, index: number) => (
            <SelectedItem
              key={`selected-${index}`}
              text={item}
              onRemove={() => handleRemove(item, category)}
              isEditMode={true}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pl-12">
          {profileSuggestions[category].map(
            (item, index) =>
              !eval(
                `selected${
                  category.charAt(0).toUpperCase() + category.slice(1)
                }`
              ).includes(item) && (
                <SuggestionBubble
                  key={`suggestion-${index}`}
                  text={item}
                  onClick={() => handleAdd(item, category)}
                />
              )
          )}
        </div>
      </div>
    );
  };

  const handleCompleteProfile = () => {
    const profileData = {
      bio,
      city,
      state,
      currentPosition,
      education,
      phoneNumber,
      extracurriculars: selectedExtracurriculars,
      clubs: selectedClubs,
      hobbies: selectedHobbies,
      awards: selectedAwards,
      volunteer: selectedVolunteer,
      socialMediaAccounts: socialMediaAccounts,
      userId: user.id,
    };

    // Validate phone number format - should be exactly 10 digits in formatted form
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    if (phoneNumber && phoneDigits.length !== 10) {
      setError('Please enter a complete 10-digit phone number');
      return;
    }

    // If there are videos, we need to handle them separately due to file uploads
    if (portfolioVideos.length > 0) {
      // Handle video uploads here - you might want to upload videos first
      // then include their URLs/IDs in the profile data
      console.log('Portfolio videos to upload:', portfolioVideos);
    }

    axiosInstance
      .post("/userprofile/profile", profileData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        navigate("/profile");
      })
      .catch((error) => {
        console.error(error);
        setError(error.response?.data?.message || 'An error occurred while saving your profile');
      });
  };

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto px-10 bg-white rounded-3xl py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">Let's get to know you better</p>
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 w-16 rounded-full ${
                  step >= i ? "bg-teal-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-16 h-16 text-gray-400" />
                  )}
                  <UploadImageModal
                    isOpen={uploadModalOpen}
                    onClose={() => setUploadModalOpen(false)}
                    onSave={handleSaveProfilePicture}
                  />
                </div>

                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="absolute bottom-0 right-0 bg-teal-600 p-2 rounded-full shadow-lg hover:bg-teal-700 transition-colors"
                >
                  <Upload className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Upload your profile picture<span className="text-red-600">*</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio<span className="text-red-600">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-3xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400 hover:border-teal-300 transition-colors"
                  rows={4}
                  value={bio}
                  placeholder="Tell employers about yourself..."
                  onChange={(e) => setBio(e.target.value)}
                  required={true}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-full border border-gray-200 bg-white hover:border-teal-300 transition-colors">
                <MapPinIcon className="w-5 h-5 text-teal-400" />
                <input
                  type="text"
                  className="flex-1 border-none focus:outline-none bg-transparent text-teal-600 placeholder-gray-400"
                  placeholder="City *"
                  value={city}
                  onChange={handleCityChange}
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-full border border-gray-200 bg-white hover:border-teal-300 transition-colors">
                <MapPinIcon className="w-5 h-5 text-teal-400" />
                <input
                  type="text"
                  className="flex-1 border-none focus:outline-none bg-transparent text-teal-600 placeholder-gray-400"
                  placeholder="State (2 letters) *"
                  value={state}
                  onChange={handleStateChange}
                  maxLength={2}
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-full border border-gray-200 bg-white hover:border-teal-300 transition-colors">
                <BriefcaseIcon className="w-5 h-5 text-teal-400" />
                <input
                  type="text"
                  className="flex-1 border-none focus:outline-none bg-transparent text-teal-600 placeholder-gray-400"
                  placeholder="Current Position (e.g. Student) *"
                  value={currentPosition}
                  onChange={handleCurrentPositionChange}
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-full border border-gray-200 bg-white hover:border-teal-300 transition-colors">
                <GraduationCapIcon className="w-5 h-5 text-teal-400" />
                <input
                  type="text"
                  className="flex-1 border-none focus:outline-none bg-transparent text-teal-600 placeholder-gray-400"
                  placeholder="Current Education *"
                  value={education}
                  onChange={handleEducationChange}
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-full border border-gray-200 bg-white hover:border-teal-300 transition-colors">
                <PhoneIcon className="w-5 h-5 text-teal-400" />
                <input
                  type="tel"
                  className="flex-1 border-none focus:outline-none bg-transparent text-teal-600 placeholder-gray-400"
                  placeholder="Phone Number *"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            {renderInput(
              "extracurriculars",
              <UsersIcon className="w-5 h-5 text-teal-400" />,
              "Extracurricular Activities"
            )}
            {renderInput(
              "clubs",
              <UsersIcon className="w-5 h-5 text-teal-400" />,
              "Clubs"
            )}
            {renderInput(
              "hobbies",
              <HeartIcon className="w-5 h-5 text-teal-400" />,
              "Hobbies"
            )}
            {renderInput(
              "awards",
              <TrophyIcon className="w-5 h-5 text-teal-400" />,
              "Awards"
            )}
            {renderInput(
              "volunteer",
              <StarIcon className="w-5 h-5 text-teal-400" />,
              "Volunteer Experience"
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <p className="text-gray-600">
                Upload portfolio and connect your social media <br/>to apply for content creation jobs
              </p>
            </div>

            {/* Portfolio Videos Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full">
                    <Video className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-teal-600">Portfolio Videos</h3>
                </div>
                {portfolioVideos.length < 4 && (
                  <label className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer">
                    <PlusIcon className="w-4 h-4" />
                    Upload Video
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => handleVideoUpload(e.target.files)}
                    />
                  </label>
                )}
              </div>
              
              {portfolioVideos.length > 0 ? (
                <div className="relative">
                  <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {portfolioVideos.map((video, index) => (
                      <div
                        key={index}
                        className="relative group bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 hover:border-teal-300 transition-colors"
                        style={{ width: '200px', height: '356px' }} // 9:16 aspect ratio
                      >
                        {/* Actual Video Player */}
                        <video 
                          src={getVideoUrl(video)} 
                          className="w-full h-full object-cover"
                          controls
                          preload="metadata"
                        />
                        
                        {/* Delete button overlay */}
                        <button
                          onClick={() => {
                            setPortfolioVideos(portfolioVideos.filter((_, i) => i !== index));
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                        
                        {/* Video number badge */}
                        <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded z-10">
                          {index + 1}
                        </div>

                        {/* Video info overlay (bottom) */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-3">
                          <div className="text-white text-xs">
                            <p className="font-medium truncate">{video.name}</p>
                            <p className="text-gray-300">{(video.size / (1024 * 1024)).toFixed(1)} MB</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <Video className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium mb-2">No portfolio videos uploaded</p>
                  <p className="text-sm">Upload up to 4 videos to showcase your work</p>
                </div>
              )}
            </div>

            {/* Social Media Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-full">
                  <UsersIcon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-teal-600">Social Media</h3>
              </div>
              
              {/* Social Media Followers - Simplified */}
              <div className="mb-6">
                {socialMediaAccounts.length > 0 ? (
                  <div className="flex items-center justify-center gap-16 text-base text-gray-700">
                    {socialMediaAccounts.map((account) => {
                      const isConnected = account.handle !== "@yourhandle" && account.followers > 0;
                      
                      return (
                        <div key={account.id}>
                          {isConnected ? (
                            <span>
                              {account.platform.charAt(0).toUpperCase() + account.platform.slice(1)} Followers: <span className="font-semibold text-gray-900">{formatFollowerCount(account.followers)}</span>
                            </span>
                          ) : (
                            <button 
                              onClick={() => {
                                if (account.platform === "instagram") {
                                  setInstagramModalOpen(true);
                                } else if (account.platform === "tiktok") {
                                  handleTikTokConnect();
                                }
                              }}
                              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                            >
                              Connect {account.platform.charAt(0).toUpperCase() + account.platform.slice(1)}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-16 text-base text-gray-700">
                    <button 
                      onClick={() => setInstagramModalOpen(true)}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                    >
                      Connect Instagram
                    </button>
                    <button 
                      onClick={handleTikTokConnect}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                    >
                      Connect Tiktok
                    </button>
                  </div>
                )}
              </div>

              <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
                <p>Connect your social media accounts to showcase your online presence to employers.</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 flex justify-between">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
            >
              Back
            </button>
          )}

          <button
            onClick={() => {
              if (step < 4) {
                handleNextButton()
              } else {
                handleCompleteProfile();
              }
            }}
            className="ml-auto flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            {step === 4 ? "Complete" : "Next"}
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Simple Instagram Connect Modal */}
      {instagramModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-6">
              <Instagram className="w-6 h-6 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-900">Connect Instagram</h3>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const handle = formData.get('handle') as string;
              const followers = parseInt(formData.get('followers') as string) || 0;
              handleInstagramConnect(handle, followers);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram Handle
                  </label>
                  <input
                    name="handle"
                    type="text"
                    placeholder="@yourusername"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Followers Count
                  </label>
                  <input
                    name="followers"
                    type="number"
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setInstagramModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompleteProfilePage;
