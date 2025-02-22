import React, { useState } from "react";
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
} from "lucide-react";
import suggestions from "components/Suggestions";
import UploadModal from "components/UploadModal";
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
  const [location, setLocation] = useState("");
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
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

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
      .put(`/userprofile/picture/${user.id}`, formData, {
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
    const categorySuggestions = suggestions[category] || [];

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
          {suggestions[category].map(
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
      location,
      currentPosition,
      education,
      phoneNumber,
      extracurriculars: selectedExtracurriculars,
      clubs: selectedClubs,
      hobbies: selectedHobbies,
      awards: selectedAwards,
      volunteer: selectedVolunteer,
      userId: user.id,
    };

    axiosInstance
      .post("/userprofile/profile", profileData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        navigate("/profile");
      })
      .catch((error) => console.error(error));
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
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 w-20 rounded-full ${
                  step >= i ? "bg-teal-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

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
                  <UploadModal
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
                Upload your profile picture
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-3xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400 hover:border-teal-300 transition-colors"
                  rows={4}
                  value={bio}
                  placeholder="Tell us about yourself..."
                  onChange={(e) => setBio(e.target.value)}
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
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-full border border-gray-200 bg-white hover:border-teal-300 transition-colors">
                <BriefcaseIcon className="w-5 h-5 text-teal-400" />
                <input
                  type="text"
                  className="flex-1 border-none focus:outline-none bg-transparent text-teal-600 placeholder-gray-400"
                  placeholder="Current Position"
                  value={currentPosition}
                  onChange={(e) => setCurrentPosition(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-full border border-gray-200 bg-white hover:border-teal-300 transition-colors">
                <GraduationCapIcon className="w-5 h-5 text-teal-400" />
                <input
                  type="text"
                  className="flex-1 border-none focus:outline-none bg-transparent text-teal-600 placeholder-gray-400"
                  placeholder="Education"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-full border border-gray-200 bg-white hover:border-teal-300 transition-colors">
                <PhoneIcon className="w-5 h-5 text-teal-400" />
                <input
                  type="tel"
                  className="flex-1 border-none focus:outline-none bg-transparent text-teal-600 placeholder-gray-400"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
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
              if (step < 3) {
                setStep(step + 1);
              } else {
                handleCompleteProfile();
              }
            }}
            className="ml-auto flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            {step === 3 ? "Complete" : "Next"}
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
