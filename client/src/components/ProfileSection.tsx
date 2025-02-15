import React, { useState, ReactNode } from "react";
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
import SuggestionBubble from "./SuggestionBubble";
import SelectedItem from "./SelectedItem";
import suggestions from "./Suggestions";
import axiosInstance from "axiosInstance";

type InputValues = {
  [key in SuggestionSection]?: string;
};

type SuggestionSection =
  | "education"
  | "extracurriculars"
  | "clubs"
  | "hobbies"
  | "work"
  | "awards"
  | "volunteer"
  | "bio";

type SelectedItems = Record<string, any[]>;

interface ProfileSectionProps {
  title: string;
  icon: React.ReactNode;
  section: SuggestionSection;
  placeholder: string;
  selectedItems?: string[];
  bio?: string;
  onChange: (
    action: "add" | "remove" | "bio",
    section: SuggestionSection,
    value: string
  ) => void;
  onSave?: (section: string, bio?: string) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  icon,
  section,
  placeholder,
  selectedItems,
  onChange,
  onSave,
}) => {
  const [bio, setBio] = useState("");
  const [inputValues, setInputValues] = useState<InputValues>({});
  const [editModes, setEditModes] = useState<
    Record<SuggestionSection, boolean>
  >({
    bio: false,
    education: false,
    extracurriculars: false,
    clubs: false,
    hobbies: false,
    work: false,
    awards: false,
    volunteer: false,
  });

  // Ensure `selectedItems` is always an array
  const selectedItemsSafe = Array.isArray(selectedItems) ? selectedItems : [];

  // Filter suggestions correctly
  const filteredSuggestions = Array.isArray(suggestions[section])
    ? suggestions[section].filter(
        (suggestion) => !selectedItemsSafe.includes(suggestion)
      )
    : [];

  const toggleEditMode = (section: SuggestionSection) => {
    setEditModes((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    section: SuggestionSection
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd(section);
    }
  };

  const handleAdd = (section: SuggestionSection, value?: string) => {
    const itemToAdd = value ?? inputValues[section];

    if (!itemToAdd) return;

    if (Array.isArray(selectedItems)) {
      onChange("add", section, itemToAdd);
    } else {
      console.error(`selectedItems[${section}] is not an array`);
    }

    setInputValues((prev) => ({
      ...prev,
      [section]: "",
    }));
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-teal-600 flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {editModes[section] ? (
            <button
              onClick={() => {
                toggleEditMode(section);
                if (section == "bio") {
                  onSave(section, bio);
                } else {
                  onSave(section);
                }
              }}
              className="p-2 rounded-full bg-teal-600 text-white hover:bg-teal-700 border border-teal-500 transition-colors"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                toggleEditMode(section);
              }}
              className="p-2 rounded-full bg-teal-50 text-teal-600 hover:bg-teal-100 border border-teal-200 transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="space-y-4 transition-all duration-300">
        {section === "bio" ? (
          <textarea
            placeholder={placeholder}
            value={bio || ""}
            onChange={(e) => {setBio(e.target.value); onChange("bio", "bio", bio)}}
            disabled={!editModes.bio}
            className={`w-full px-4 py-3 rounded-xl bg-white text-sm text-teal-600 placeholder-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-300 transition-colors min-h-[120px] resize-none ${
              editModes.bio
                ? "border border-teal-200 hover:border-teal-300"
                : "border-none"
            }`}
          />
        ) : (
          editModes[section] && (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder={placeholder}
                value={inputValues[section] || ""}
                className="flex-1 px-4 py-2 rounded-full bg-white text-sm text-teal-600 border border-teal-200 placeholder-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-300 hover:border-teal-300 transition-colors"
                onChange={(e) =>
                  setInputValues({
                    ...inputValues,
                    [section]: e.target.value,
                  })
                }
                onKeyDown={(e) => handleKeyDown(e, section)}
              />
              <button
                onClick={() => handleAdd(section)}
                className="p-2 rounded-full bg-white text-teal-600 hover:bg-teal-50 border border-teal-200 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          )
        )}
        {selectedItemsSafe.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedItemsSafe.map((item) => (
              <SelectedItem
                key={item}
                text={item}
                onRemove={() => onChange("remove", section, item)}
                isEditMode={editModes[section]}
              />
            ))}
          </div>
        )}
        {editModes[section] && section !== "bio" && (
          <div className="flex flex-wrap gap-2">
            {filteredSuggestions.map((suggestion) => (
              <SuggestionBubble
                key={suggestion}
                text={suggestion}
                onClick={() => handleAdd(section, suggestion)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileSection;
