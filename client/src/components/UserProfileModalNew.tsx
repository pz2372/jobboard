import React from "react";
import {
  X,
  UserCircle,
  MapPin,
  Mail,
  GraduationCap,
  Briefcase,
  Users,
  Heart,
  Award,
  Star,
  Instagram,
  Video,
  BookOpen,
  Smile,
} from "lucide-react";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">
            {user?.firstName && user?.lastName 
              ? `${user.firstName} ${user.lastName}'s Profile` 
              : 'User Profile'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {user ? (
            <div className="space-y-6">
              {/* Profile Header Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Profile Image */}
                  <div className="w-24 h-24 rounded-full bg-white border-4 border-blue-200 flex items-center justify-center overflow-hidden shadow-lg">
                    {user.profile?.profileImage ? (
                      <img
                        src={user.profile.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircle className="w-16 h-16 text-blue-400" />
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      {user.firstName} {user.lastName}
                    </h1>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span>{user.email}</span>
                      </div>
                      
                      {user.profile?.city && user.profile?.state && (
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span>{user.profile.city}, {user.profile.state}</span>
                        </div>
                      )}
                    </div>

                    {user.profile?.bio && (
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">About</h3>
                        <p className="text-gray-600 leading-relaxed">{user.profile.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Education */}
                {user.profile?.education && user.profile.education.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Education</h3>
                    </div>
                    <div className="space-y-2">
                      {user.profile.education.map((item, index) => (
                        <div key={index} className="bg-green-50 rounded-lg p-3 border border-green-100">
                          <p className="text-gray-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Work Experience */}
                {user.profile?.work && user.profile.work.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
                    </div>
                    <div className="space-y-2">
                      {user.profile.work.map((item, index) => (
                        <div key={index} className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                          <p className="text-gray-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracurriculars */}
                {user.profile?.extracurriculars && user.profile.extracurriculars.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-orange-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Extracurriculars</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {user.profile.extracurriculars.map((item, index) => (
                        <span key={index} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm border border-orange-200">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clubs */}
                {user.profile?.clubs && user.profile.clubs.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Clubs & Organizations</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {user.profile.clubs.map((item, index) => (
                        <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hobbies */}
                {user.profile?.hobbies && user.profile.hobbies.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                        <Smile className="w-5 h-5 text-pink-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Hobbies</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {user.profile.hobbies.map((item, index) => (
                        <span key={index} className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-sm border border-pink-200">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Awards */}
                {user.profile?.awards && user.profile.awards.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-yellow-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Awards</h3>
                    </div>
                    <div className="space-y-2">
                      {user.profile.awards.map((item, index) => (
                        <div key={index} className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
                          <p className="text-gray-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Volunteer Experience */}
                {user.profile?.volunteer && user.profile.volunteer.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Heart className="w-5 h-5 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Volunteer Experience</h3>
                    </div>
                    <div className="space-y-2">
                      {user.profile.volunteer.map((item, index) => (
                        <div key={index} className="bg-red-50 rounded-lg p-3 border border-red-100">
                          <p className="text-gray-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Social Media & Portfolio Section */}
              {(user.profile?.instagram || user.profile?.tiktok || (user.profile?.portfolioVideos && user.profile.portfolioVideos.length > 0)) && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Portfolio & Social Media</h3>
                  
                  {/* Social Media Links */}
                  {(user.profile?.instagram || user.profile?.tiktok) && (
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-700 mb-3">Social Media</h4>
                      <div className="flex gap-4">
                        {user.profile?.instagram && (
                          <a
                            href={`https://instagram.com/${user.profile.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <Instagram className="w-5 h-5" />
                            {user.profile.instagram}
                          </a>
                        )}
                        {user.profile?.tiktok && (
                          <a
                            href={`https://tiktok.com/@${user.profile.tiktok.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <Video className="w-5 h-5" />
                            {user.profile.tiktok}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Portfolio Videos */}
                  {user.profile?.portfolioVideos && user.profile.portfolioVideos.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Portfolio Videos</h4>
                      <div className="flex gap-4 overflow-x-auto pb-4">
                        {user.profile.portfolioVideos.map((videoUrl, index) => (
                          <div
                            key={index}
                            className="relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 hover:border-blue-300 transition-colors"
                            style={{ width: '200px', height: '356px' }}
                          >
                            <video 
                              src={videoUrl} 
                              className="w-full h-full object-cover"
                              controls
                              preload="metadata"
                            />
                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                              Video {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No user data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
