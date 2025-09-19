import React, { useState, useEffect } from "react";
import {
  GraduationCapIcon,
  HeartIcon,
  BriefcaseIcon,
  UsersIcon,
  UserCircle,
  MapPin,
  BookOpenIcon,
  SmileIcon,
  AwardIcon,
  X,
  Instagram,
  Video,
} from "lucide-react";
import axiosInstance from "axiosInstance";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; // Accept user object directly
}

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  city?: string;
  state?: string;
  bio?: string;
  education?: string[];
  extracurriculars?: string[];
  clubs?: string[];
  hobbies?: string[];
  work?: string[];
  awards?: string[];
  volunteer?: string[];
  instagram?: string;
  tiktok?: string;
  portfolioVideos?: string[];
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      // Set the user profile directly from the passed user object
      setUserProfile({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profile?.profileImage,
        city: user.profile?.city,
        state: user.profile?.state,
        bio: user.profile?.bio,
        education: user.profile?.education,
        extracurriculars: user.profile?.extracurriculars,
        clubs: user.profile?.clubs,
        hobbies: user.profile?.hobbies,
        work: user.profile?.work,
        awards: user.profile?.awards,
        volunteer: user.profile?.volunteer,
        instagram: user.profile?.instagram,
        tiktok: user.profile?.tiktok,
        portfolioVideos: user.profile?.portfolioVideos,
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const ProfileSection = ({ 
    title, 
    icon, 
    items, 
    content 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    items?: string[]; 
    content?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-teal-600">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      
      {content ? (
        <p className="text-gray-700 leading-relaxed">{content}</p>
      ) : items && items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={index}
              className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm border border-teal-200"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No information provided</p>
      )}
    </div>
  );

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-teal-50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl shadow-sm p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-teal-600">{user.firstName} {user.lastName}'s Profile</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
          ) : userProfile ? (
            <>
              {/* Profile Header */}
              <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-32 h-32 rounded-full bg-teal-50 border-2 border-teal-100 flex items-center justify-center overflow-hidden">
                    {userProfile.profileImage ? (
                      <img
                        src={userProfile.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircle className="w-16 h-16 text-teal-300" />
                    )}
                  </div>
                  <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold text-teal-600 mb-2">
                      {userProfile.firstName} {userProfile.lastName}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 text-teal-500" />
                      <span>
                        {userProfile.city && userProfile.state
                          ? `${userProfile.city}, ${userProfile.state}`
                          : "Location not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Social Media & Portfolio Section */}
              {(userProfile.instagram || userProfile.tiktok || (userProfile.portfolioVideos && userProfile.portfolioVideos.length > 0)) && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Video className="w-6 h-6 text-teal-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Portfolio & Social Media</h3>
                  </div>
                  
                  {/* Social Media Links */}
                  {(userProfile.instagram || userProfile.tiktok) && (
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-700 mb-3">Social Media</h4>
                      <div className="flex gap-4">
                        {userProfile.instagram && (
                          <a
                            href={`https://instagram.com/${userProfile.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <Instagram className="w-5 h-5" />
                            {userProfile.instagram}
                          </a>
                        )}
                        {userProfile.tiktok && (
                          <a
                            href={`https://tiktok.com/@${userProfile.tiktok.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <Video className="w-5 h-5" />
                            {userProfile.tiktok}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Portfolio Videos */}
                  {userProfile.portfolioVideos && userProfile.portfolioVideos.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Portfolio Videos</h4>
                      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {userProfile.portfolioVideos.map((videoUrl, index) => (
                          <div
                            key={index}
                            className="relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 hover:border-teal-300 transition-colors"
                            style={{ width: '200px', height: '356px' }} // Smaller than original but maintains 9:16 aspect ratio
                          >
                            <video 
                              src={videoUrl} 
                              className="w-full h-full object-cover"
                              controls
                              preload="metadata"
                            />
                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Profile Sections */}
              <div className="space-y-6">
                <ProfileSection
                  title="Bio"
                  icon={<UserCircle className="w-6 h-6" />}
                  content={userProfile.bio || "No bio provided"}
                />
                
                <ProfileSection
                  title="Education"
                  icon={<GraduationCapIcon className="w-6 h-6" />}
                  items={userProfile.education}
                />
                
                <ProfileSection
                  title="Extracurriculars"
                  icon={<BookOpenIcon className="w-6 h-6" />}
                  items={userProfile.extracurriculars}
                />
                
                <ProfileSection
                  title="Clubs"
                  icon={<UsersIcon className="w-6 h-6" />}
                  items={userProfile.clubs}
                />
                
                <ProfileSection
                  title="Hobbies"
                  icon={<SmileIcon className="w-6 h-6" />}
                  items={userProfile.hobbies}
                />
                
                <ProfileSection
                  title="Work Experience"
                  icon={<BriefcaseIcon className="w-6 h-6" />}
                  items={userProfile.work}
                />
                
                <ProfileSection
                  title="Awards"
                  icon={<AwardIcon className="w-6 h-6" />}
                  items={userProfile.awards}
                />
                
                <ProfileSection
                  title="Volunteer Experience"
                  icon={<HeartIcon className="w-6 h-6" />}
                  items={userProfile.volunteer}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Failed to load profile information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
