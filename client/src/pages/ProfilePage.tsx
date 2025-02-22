import React, { useState, useEffect } from "react";
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
import ProfileSection from "components/ProfileSection";
import SettingsModal from "components/SettingsModal";
import axiosInstance from "axiosInstance";
import { RootState } from "redux/store";
import { useSelector } from "react-redux";

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

type SelectedItems = Record<string, any[]>;

const ProfilePage = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [bio, setBio] = useState<string>("");
  const [pendingChanges, setPendingChanges] = useState<
    Record<string, string | string[]>
  >({});

  type SectionKey = keyof typeof selectedItems;

  const user = useSelector((state: RootState) => state.auth.user);

  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    education: [],
    extracurriculars: [],
    clubs: [],
    hobbies: [],
    work: [],
    awards: [],
    volunteer: [],
  });

  useEffect(() => {
    axiosInstance
      .get(`userprofile/${user.id}`)
      .then((response) => {
        const data = response.data;
        setSelectedItems({
          education: data.education || [],
          extracurriculars: data.extracurriculars || [],
          clubs: data.clubs || [],
          hobbies: data.hobbies || [],
          work: data.work || [],
          awards: data.awards || [],
          volunteer: data.volunteer || [],
        });
        setProfilePicture(data.profileImage);
        setLocation(data.location);
        setBio(data.bio);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user.id]);

  const handleSaveProfilePicture = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setProfilePicture(reader.result);
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

  const handleProfileSectionUpdate = (
    action: string,
    section: string,
    value: string
  ) => {
    setSelectedItems((prev) => {
      const updatedSection = Array.isArray(prev[section]) ? prev[section] : [];

      let newItems;
      if (action === "add") {
        newItems = [...updatedSection, value];
      } else if (action === "remove") {
        newItems = updatedSection.filter((item) => item !== value);
      } else {
        newItems = updatedSection;
      }
      return {
        ...prev,
        [section]: newItems,
      };
    });

    setPendingChanges((prev) => {
      const updatedSection = Array.isArray(prev[section]) ? prev[section] : [];

      let newItems;
      if (action === "add") {
        newItems = [...updatedSection, value];
      } else if (action === "remove") {
        newItems = updatedSection.filter((item) => item !== value);
      } else if (action === "bio") {
        newItems = value;
      } else {
        newItems = updatedSection;
      }
      return {
        ...prev,
        [section]: newItems,
      };
    });
  };

  const handleSaveProfileSection = async (
    section: SuggestionSection,
    bio?: string
  ) => {
    if (!pendingChanges[section]) return;

    try {
      if (section == "bio") {
        await axiosInstance.put(`/userprofile/${user.id}`, {
          [section]: bio,
        });
      } else {
        await axiosInstance.put(`/userprofile/${user.id}`, {
          [section]: selectedItems[section],
        });
      }

      setPendingChanges((prev) => {
        const { [section]: _, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      console.error(`Error updating ${section}:`, error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-teal-50">
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSave={handleSaveProfilePicture}
      />

      {settingsModalOpen && (
        <SettingsModal onClose={() => setSettingsModalOpen(false)} />
      )}

      <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200 mb-12 relative">
        <button
          onClick={() => setSettingsModalOpen(true)}
          className="absolute top-4 right-4 p-2 rounded-full bg-teal-50 text-teal-600 hover:bg-teal-100 border border-teal-200 transition-colors group"
        >
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
              onClick={() => setUploadModalOpen(true)}
              className="absolute bottom-0 right-0 bg-teal-600 p-2 rounded-full shadow-lg hover:bg-teal-700 transition-colors"
            >
              <Upload className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-teal-600 mb-2">
              {user.firstName} {user.lastName}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-teal-500" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-8">
        <ProfileSection
          title={"Bio"}
          icon={<UserCircle className="w-6 h-6" />}
          section={"bio"}
          placeholder={bio}
          bio={bio}
          onChange={handleProfileSectionUpdate}
          onSave={handleSaveProfileSection}
        />
        <ProfileSection
          title={"Education"}
          icon={<GraduationCapIcon className="w-6 h-6" />}
          section={"education"}
          placeholder={"Add education..."}
          selectedItems={selectedItems["education"]}
          onChange={handleProfileSectionUpdate}
          onSave={handleSaveProfileSection}
        />
        <ProfileSection
          title={"Extracurriculars"}
          icon={<BookOpenIcon className="w-6 h-6" />}
          section={"extracurriculars"}
          placeholder={"Add extracurricular activity..."}
          selectedItems={selectedItems["extracurriculars"]}
          onChange={handleProfileSectionUpdate}
          onSave={handleSaveProfileSection}
        />
        <ProfileSection
          title={"Clubs"}
          icon={<UsersIcon className="w-6 h-6" />}
          section={"clubs"}
          placeholder={"Add club..."}
          selectedItems={selectedItems["clubs"]}
          onChange={handleProfileSectionUpdate}
          onSave={handleSaveProfileSection}
        />
        <ProfileSection
          title={"Hobbies"}
          icon={<SmileIcon className="w-6 h-6" />}
          section={"hobbies"}
          placeholder={"Add hobby..."}
          selectedItems={selectedItems["hobbies"]}
          onChange={handleProfileSectionUpdate}
          onSave={handleSaveProfileSection}
        />
        <ProfileSection
          title={"Work Experience"}
          icon={<BriefcaseIcon className="w-6 h-6" />}
          section={"work"}
          placeholder={"Add work experience..."}
          selectedItems={selectedItems["work"]}
          onChange={handleProfileSectionUpdate}
          onSave={handleSaveProfileSection}
        />
        <ProfileSection
          title={"Awards"}
          icon={<AwardIcon className="w-6 h-6" />}
          section={"awards"}
          placeholder={"Add award..."}
          selectedItems={selectedItems["awards"]}
          onChange={handleProfileSectionUpdate}
          onSave={handleSaveProfileSection}
        />
        <ProfileSection
          title={"Volunteer"}
          icon={<HeartIcon className="w-6 h-6" />}
          section={"volunteer"}
          placeholder={"Add volunteer experience..."}
          selectedItems={selectedItems["volunteer"]}
          onChange={handleProfileSectionUpdate}
          onSave={handleSaveProfileSection}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
