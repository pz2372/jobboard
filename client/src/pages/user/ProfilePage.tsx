import React, { useState, useEffect } from "react";
import {
  GraduationCapIcon,
  HeartIcon,
  BriefcaseIcon,
  UsersIcon,
  UserCircle,
  MapPin,
  Upload,
  BookOpenIcon,
  SmileIcon,
  AwardIcon,
  Settings,
  Instagram,
  Video,
  CheckCircle,
  Building2,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import UploadImageModal from "../../components/UploadImageModal";
import ProfileSection from "components/ProfileSection";
import SocialMediaSection from "components/SocialMediaSection";
import AcceptedApplicationsSection from "components/AcceptedApplicationsSection";
import SettingsModal from "components/userSettings/SettingsModal";
import axiosInstance from "axiosInstance";
import { RootState } from "redux/store";
import { useSelector, useDispatch } from "react-redux";
import { setUserProfile } from "../../redux/profileSlice";
import { FormatDate } from "../../components/methods/FormatDate";

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

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [bio, setBio] = useState<string>("");
  const [acceptedApplications, setAcceptedApplications] = useState<any[]>([]);
  const [pendingChanges, setPendingChanges] = useState<
    Record<string, string | string[]>
  >({});

  const user = useSelector((state: RootState) => state.auth.user);
  const userProfile = useSelector((state: RootState) => state.profile.userProfile);

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
    const fetchProfileData = async () => {
      try {
        // Only fetch if Redux store doesn't have userProfile data
        if (userProfile) {
          console.log('Profile already available in Redux store, skipping fetch');
          return;
        }

        // Check if we have cached data
        const cachedData = localStorage.getItem("profileData");
        const cacheTimestamp = localStorage.getItem("profileDataTimestamp");
        const now = new Date().getTime();
        const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        if (
          cachedData &&
          cacheTimestamp &&
          now - parseInt(cacheTimestamp) < CACHE_DURATION
        ) {
          // Use cached data if it's not expired
         
          const data = JSON.parse(cachedData);
          
          // Update Redux store with cached data
          dispatch(setUserProfile(data));
        } else {
          // Fetch fresh data from server
        
          const response = await axiosInstance.get(`userprofile/${user.id}`);
          const data = response.data;

          // Update Redux store with fresh data
          dispatch(setUserProfile(data));

          // Cache the new data
          localStorage.setItem("profileData", JSON.stringify(data));
          localStorage.setItem("profileDataTimestamp", now.toString());
        }
      } catch (error: any) {
        console.error("Error fetching profile data:", error);
        
        // If profile doesn't exist (404 error), navigate to CompleteProfilePage
        if (error.response && error.response.status === 404) {
          navigate("/completeprofile");
          return;
        }
        
        // Handle other errors (network issues, server errors, etc.)
        console.error("Unexpected error while fetching profile:", error);
      }
    };

    const fetchAcceptedApplications = async () => {
      try {
        const response = await axiosInstance.get(`/applications/user/${user.id}`);
        const applications = response.data || [];
        
        // Filter for accepted applications
        const accepted = applications.filter((app: any) => app.status === "Accepted");
        setAcceptedApplications(accepted);
      } catch (error) {
        console.error("Error fetching accepted applications:", error);
        setAcceptedApplications([]);
      }
    };

    fetchProfileData();
    fetchAcceptedApplications();
  }, [user.id, navigate, dispatch]); // Removed userProfile from dependencies to avoid infinite loop

  // Separate useEffect to listen for Redux userProfile changes
  useEffect(() => {
    if (userProfile) {
      setSelectedItems({
        education: userProfile.education || [],
        extracurriculars: userProfile.extracurriculars || [],
        clubs: userProfile.clubs || [],
        hobbies: userProfile.hobbies || [],
        work: userProfile.work || [],
        awards: userProfile.awards || [],
        volunteer: userProfile.volunteer || [],
      });
      setProfilePicture(userProfile.profileImage);
      setLocation(`${userProfile.city || ''}, ${userProfile.state || ''}`);
      setBio(userProfile.bio);
    }
  }, [userProfile]); // This effect runs when userProfile in Redux changes

  const handleSaveProfilePicture = async (file: File | null) => {
    if (!file) return;

    // Update local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setProfilePicture(reader.result);
      }
    };
    reader.readAsDataURL(file);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("file", file, file.name);


      const response = await axiosInstance.put(
        `/userprofile/picture/${user.id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          transformRequest: [(data) => data],
        }
      );

      if (response.data?.profileImage) {
        setProfilePicture(response.data.profileImage);
      }
      
      // Update Redux store and localStorage with the updated profile
      if (response.data?.updatedProfile) {
        const updatedProfile = response.data.updatedProfile;
        dispatch(setUserProfile(updatedProfile));
        
        const now = new Date().getTime();
        localStorage.setItem("profileData", JSON.stringify(updatedProfile));
        localStorage.setItem("profileDataTimestamp", now.toString());
      }
      
    } catch (error: any) {
      console.error(
        "Error uploading profile picture:",
        error.response?.data || error.message
      );
      // Revert the preview if upload failed
      setProfilePicture(null);
      throw error; // Re-throw to be handled by the modal
    }
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
        // Ensure we're working with an array for filter operation
        const arraySection = Array.isArray(updatedSection) ? updatedSection : [];
        newItems = arraySection.filter((item) => item !== value);
      } else {
        newItems = updatedSection;
      }
      return {
        ...prev,
        [section]: newItems,
      };
    });

    setPendingChanges((prev) => {
      const currentValue = prev[section];
      const updatedSection: string[] = Array.isArray(currentValue) ? currentValue : [];

      let newItems: string | string[];
      if (action === "add") {
        newItems = [...updatedSection, value];
      } else if (action === "remove") {
        // Ensure we're working with an array for filter operation
        const arraySection = Array.isArray(updatedSection) ? updatedSection : [];
        newItems = arraySection.filter((item) => item !== value);
      } else if (action === "bio") {
        newItems = value; // This will be a string for bio
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
    const now = new Date().getTime();
    try {
      console.log(`Saving ${section}`); // Debug log
      console.log(`Pending changes for ${section}:`, pendingChanges[section]); // Debug log
      console.log(`Selected items for ${section}:`, selectedItems[section]); // Debug log
      
      if (section == "bio") {
        if (!bio && !pendingChanges[section]) return;
        
        await axiosInstance
          .put(`/userprofile/${user.id}`, {
            [section]: bio || pendingChanges[section],
          })
          .then((response) => {
            console.log('Bio update response:', response.data); // Debug log
            const updatedProfile = response.data.updatedProfile;
            
            // Update Redux store
            dispatch(setUserProfile(updatedProfile));
            
            localStorage.setItem(
              "profileData",
              JSON.stringify(updatedProfile)
            );
            localStorage.setItem("profileDataTimestamp", now.toString());
          });
      } else {
        if (!pendingChanges[section]) return;
        
        await axiosInstance
          .put(`/userprofile/${user.id}`, {
            [section]: selectedItems[section], // This should contain the current state including changes
          })
          .then((response) => {
            console.log(`${section} update response:`, response.data); // Debug log
            const updatedProfile = response.data.updatedProfile;
            
            // Update Redux store
            dispatch(setUserProfile(updatedProfile));
            
            localStorage.setItem(
              "profileData",
              JSON.stringify(updatedProfile)
            );
            localStorage.setItem("profileDataTimestamp", now.toString());
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
      <UploadImageModal
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

      {/* Accepted Applications Section */}
      <AcceptedApplicationsSection acceptedApplications={acceptedApplications} />

      <div className="space-y-8">

        <SocialMediaSection />
        
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
