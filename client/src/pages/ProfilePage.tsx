import React, { useState, ReactNode } from "react"
import {
  PlusIcon,
  GraduationCapIcon,
  TrophyIcon,
  HeartIcon,
  BriefcaseIcon,
  UsersIcon,
  StarIcon,
  UserCircle,
  Briefcase,
  MapPin,
  Upload,
  BookOpenIcon,
  SmileIcon,
  AwardIcon,
  Settings,
  X,
  PencilIcon,
  CheckIcon,
} from "lucide-react";
import SelectedItem from "../components/SelectedItem";
import SuggestionBubble from "../components/SuggestionBubble";
import UploadModal from "../components/UploadModal";

type SuggestionSection =
  | "education"
  | "extracurriculars"
  | "clubs"
  | "hobbies"
  | "work"
  | "awards"
  | "volunteer"
  | "bio";

  type InputValues = {
    [key in SuggestionSection]?: string;
  };


  const suggestions: { [key in SuggestionSection]: string[] } = {
    education: ["Bachelor's Degree", "Master's Degree", "High School Diploma", "Certification"],
    extracurriculars: ["Student Government", "Drama Club", "Debate Team", "Sports Team"],
    clubs: ["Chess Club", "Robotics Club", "Art Club", "Science Club"],
    hobbies: ["Photography", "Reading", "Playing Guitar", "Cooking"],
    work: ["Internship", "Part-time Job", "Summer Position", "Research Assistant"],
    awards: ["Dean's List", "Academic Excellence", "Leadership Award", "Sports Achievement"],
    volunteer: ["Community Service", "Food Bank", "Animal Shelter", "Environmental Projects"],
    bio:[]
  };

type SelectedItems = Record<string, any[]>;


const ProfilePage = () => {
  const [inputValues, setInputValues] = useState<InputValues>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  type SectionKey = keyof typeof selectedItems; 

  const [editModes, setEditModes] = useState({
    bio: false,
    education: false,
    extracurriculars: false,
    clubs: false,
    hobbies: false,
    work: false,
    awards: false,
    volunteer: false,
  });
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    education: [],
    extracurriculars: [],
    clubs: [],
    hobbies: [],
    work: [],
    awards: [],
    volunteer: [],
  });

  const toggleEditMode = (section: any) => {
    setEditModes((prev: any) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAdd = (section: string, value?: string) => {
    const itemToAdd = value ?? inputValues[section as keyof InputValues];

    if (!itemToAdd) return; // Ensure value exists
  
    setSelectedItems((prev) => ({
      ...prev,
      [section]: prev[section] ? [...prev[section], itemToAdd] : [itemToAdd], // Handle undefined case
    }));
  
    setInputValues((prev) => ({
      ...prev,
      [section]: "", // Clear input after adding
    }));
  };

  const handleRemove = (section: string, value: any) => {
    setSelectedItems((prev) => ({
      ...prev,
      [section]: prev[section]?.filter((item: any) => item !== value),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, section: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd(section);
    }
  };

  const handleSaveProfilePicture = (file: File | null) => {
    if (!file) return;
  
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setProfilePicture(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const renderSection = (
    title: string,
    icon: ReactNode,
    section: SuggestionSection,
    placeholder: string
  ) => (
    <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-teal-600 mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <div className="space-y-4">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder={placeholder}
            className="flex-1 px-4 py-2 rounded-full bg-teal-50 text-sm text-teal-600 border border-teal-200 placeholder-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-300 hover:bg-teal-100 transition-colors"
            onChange={(e) =>
              setInputValues({
                ...inputValues,
                [section]: e.target.value,
              })
            }
          />
          <button
            onClick={() => handleAdd(section)}
            className="p-2 rounded-full bg-teal-50 text-teal-600 hover:bg-teal-100 border border-teal-200 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions[section].map((suggestion) => (
            <SuggestionBubble
              key={suggestion}
              text={suggestion}
              onClick={(text: string) => handleAdd(section, text)}
            />
          ))}
        </div>
      </div>
    </section>
  );

  

  return (
    <div className="w-full min-h-screen bg-white">
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProfilePicture}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200 mb-12 relative">
          <button className="absolute top-4 right-4 p-2 rounded-full bg-teal-50 text-teal-600 hover:bg-teal-100 border border-teal-200 transition-colors group">
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-teal-50 border-2 border-teal-100 flex items-center justify-center overflow-hidden">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-16 h-16 text-teal-300" />
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute bottom-0 right-0 bg-teal-600 p-2 rounded-full shadow-lg hover:bg-teal-700 transition-colors"
              >
                <Upload className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-teal-600 mb-2">
                John Doe
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-teal-500" />
                <span>San Francisco, California</span>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-8">
          {renderSection(
            "Bio",
            <UserCircle className="w-6 h-6" />,
            "bio",
            "Tell us about yourself..."
          )}
          {renderSection(
            "Education",
            <GraduationCapIcon className="w-6 h-6" />,
            "education",
            "Add education..."
          )}
          {renderSection(
            "Extracurriculars",
            <BookOpenIcon className="w-6 h-6" />,
            "extracurriculars",
            "Add extracurricular activity..."
          )}
          {renderSection(
            "Clubs",
            <UsersIcon className="w-6 h-6" />,
            "clubs",
            "Add club..."
          )}
          {renderSection(
            "Hobbies",
            <SmileIcon className="w-6 h-6" />,
            "hobbies",
            "Add hobby..."
          )}
          {renderSection(
            "Work Experience",
            <BriefcaseIcon className="w-6 h-6" />,
            "work",
            "Add work experience..."
          )}
          {renderSection(
            "Awards",
            <AwardIcon className="w-6 h-6" />,
            "awards",
            "Add award..."
          )}
          {renderSection(
            "Volunteer",
            <HeartIcon className="w-6 h-6" />,
            "volunteer",
            "Add volunteer experience..."
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
