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
} from "lucide-react";

const SuggestionBubble = ({ text, onClick }: any) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-gray-200 bg-white text-teal-500 hover:bg-teal-50 hover:border-teal-300 transition-all"
  >
    <PlusIcon className="w-4 h-4" />
    <span className="text-sm">{text}</span>
  </button>
);
const SelectedBubble = ({ text, onRemove }: any) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-teal-300 bg-white text-teal-700 shadow-sm">
    <span className="text-sm font-medium">{text}</span>
    <button onClick={onRemove} className="hover:text-teal-900">
      <XIcon className="w-4 h-4" />
    </button>
  </div>
);

const CompleteProfilePage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedExtracurriculars, setSelectedExtracurriculars] = useState([]);
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [selectedAwards, setSelectedAwards] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState([]);
  const [inputValues, setInputValues] = useState({
    extracurriculars: "",
    clubs: "",
    hobbies: "",
    awards: "",
    volunteer: "",
  });
  const suggestions = {
    education: [
      "High School Diploma",
      "Bachelor's Degree",
      "Master's Degree",
      "PhD",
    ],
    extracurriculars: [
      "Sports Team",
      "Student Government",
      "Debate Club",
      "Theater",
    ],
    clubs: ["Chess Club", "Book Club", "Coding Club", "Environmental Club"],
    hobbies: ["Reading", "Photography", "Gaming", "Cooking"],
    work: ["Internship", "Part-time Job", "Full-time Position", "Freelance"],
    awards: [
      "Academic Excellence",
      "Leadership Award",
      "Sports Achievement",
      "Community Service",
    ],
    volunteer: [
      "Local Food Bank",
      "Animal Shelter",
      "Environmental Cleanup",
      "Teaching Assistant",
    ],
  };
  const handleAdd = (item, category, isManualInput = false) => {
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
  const handleRemove = (item, category) => {
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
  const handleInputChange = (e, category) => {
    setInputValues({
      ...inputValues,
      [category]: e.target.value,
    });
  };
  const handleKeyPress = (e, category) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd("", category, true);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const renderInput = (category, icon, placeholder) => (
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
        {eval(
          `selected${category.charAt(0).toUpperCase() + category.slice(1)}`
        ).map((item, index) => (
          <SelectedBubble
            key={`selected-${index}`}
            text={item}
            onRemove={() => handleRemove(item, category)}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 pl-12">
        {suggestions[category].map(
          (item, index) =>
            !eval(
              `selected${category.charAt(0).toUpperCase() + category.slice(1)}`
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

  return (
    <div className="min-h-screen w-full bg-white">
      <main className="max-w-2xl mx-auto px-4 py-12">
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
                </div>
                <label className="absolute bottom-0 right-0 bg-teal-600 p-2 rounded-full shadow-lg hover:bg-teal-700 transition-colors cursor-pointer">
                  <CameraIcon className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500">
                Upload your profile picture
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400 hover:border-teal-300 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-3xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400 hover:border-teal-300 transition-colors"
                  rows={4}
                  placeholder="Tell us about yourself..."
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
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-full border border-gray-200 bg-white hover:border-teal-300 transition-colors">
                <BriefcaseIcon className="w-5 h-5 text-teal-400" />
                <input
                  type="text"
                  className="flex-1 border-none focus:outline-none bg-transparent text-teal-600 placeholder-gray-400"
                  placeholder="Current Position"
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-full border border-gray-200 bg-white hover:border-teal-300 transition-colors">
                <GraduationCapIcon className="w-5 h-5 text-teal-400" />
                <input
                  type="text"
                  className="flex-1 border-none focus:outline-none bg-transparent text-teal-600 placeholder-gray-400"
                  placeholder="Education"
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-full border border-gray-200 bg-white hover:border-teal-300 transition-colors">
                <PhoneIcon className="w-5 h-5 text-teal-400" />
                <input
                  type="tel"
                  className="flex-1 border-none focus:outline-none bg-transparent text-teal-600 placeholder-gray-400"
                  placeholder="Phone Number"
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-full border border-gray-200 bg-white hover:border-teal-300 transition-colors">
                <MailIcon className="w-5 h-5 text-teal-400" />
                <input
                  type="email"
                  className="flex-1 border-none focus:outline-none bg-transparent text-teal-600 placeholder-gray-400"
                  placeholder="Email Address"
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
            onClick={() => (step < 3 ? setStep(step + 1) : null)}
            className="ml-auto flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            {step === 3 ? "Complete" : "Next"}
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default CompleteProfilePage;
