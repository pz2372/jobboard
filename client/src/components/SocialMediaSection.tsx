import React, { useState, useEffect } from "react";
import {
  Instagram,
  Video,
  Plus,
  Users,
  Trash2,
  Play,
} from "lucide-react";
import axiosInstance from "../axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import VideoUploadModal from "./VideoUploadModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import InstagramConnectModal from "./InstagramConnectModal";

interface SocialMediaAccount {
  id: number;
  platform: "instagram" | "tiktok";
  handle: string;
  followers: number;
  profileUrl?: string;
}

const SocialMediaSection: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userProfile = useSelector((state: RootState) => state.profile.userProfile);
  
  const [socialMediaAccounts, setSocialMediaAccounts] = useState<SocialMediaAccount[]>([]);
  const [portfolioVideos, setPortfolioVideos] = useState<string[]>([]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [instagramModalOpen, setInstagramModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<{ url: string; index: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialMediaData();
    fetchPortfolioVideos();
  }, [user.id]);

  useEffect(() => {
    if (userProfile?.portfolioVideos) {
      setPortfolioVideos(userProfile.portfolioVideos);
    }
  }, [userProfile]);

  const fetchSocialMediaData = async () => {
    try {
      if (!userProfile?.id) {
        console.log("No userProfile.id available yet");
        return;
      }
      
      console.log("Fetching social media data for userProfile.id:", userProfile.id);
      const response = await axiosInstance.get(`/user-social-media/profile/${userProfile.id}`);
      console.log("Social media response:", response.data);
      
      // For now, always show test data so you can see the layout
      setSocialMediaAccounts([
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
    } catch (error) {
      console.error("Error fetching social media data:", error);
      // Show test data even on error
      setSocialMediaAccounts([
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
    }
  };

  const fetchPortfolioVideos = async () => {
    try {
      const response = await axiosInstance.get(`/userprofile/${user.id}/videos`);
      setPortfolioVideos(response.data.videos || []);
    } catch (error) {
      console.error("Error fetching portfolio videos:", error);
      setPortfolioVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const uploadPortfolioVideo = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('video', file);

      await axiosInstance.post(`/userprofile/${user.id}/videos/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchPortfolioVideos();
    } catch (error: any) {
      console.error("Error uploading video:", error);
      alert(error.response?.data?.message || "Error uploading video");
    }
  };

  const removePortfolioVideo = async (videoUrl: string) => {
    try {
      const encodedUrl = encodeURIComponent(videoUrl);
      await axiosInstance.delete(`/userprofile/${user.id}/videos/${encodedUrl}`);
      fetchPortfolioVideos();
    } catch (error) {
      console.error("Error removing video:", error);
    }
  };

  const handleDeleteClick = (videoUrl: string, index: number) => {
    setVideoToDelete({ url: videoUrl, index });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (videoToDelete) {
      await removePortfolioVideo(videoToDelete.url);
      setDeleteModalOpen(false);
      setVideoToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setVideoToDelete(null);
  };

  const handleInstagramConnect = async (handle: string, followers: number) => {
    try {
      // Update the local state immediately
      setSocialMediaAccounts(prev => 
        prev.map(account => 
          account.platform === "instagram" 
            ? { ...account, handle, followers, profileUrl: `https://instagram.com/${handle.replace('@', '')}` }
            : account
        )
      );

      // Here you can also make an API call to save to backend
      // await axiosInstance.post(`/user-social-media`, {
      //   platform: "instagram",
      //   handle,
      //   followers,
      //   userProfileId: userProfile.id
      // });
      
      console.log("Instagram connected:", { handle, followers });
    } catch (error) {
      console.error("Error connecting Instagram:", error);
    }
  };

  const handleTikTokConnect = () => {
    // TODO: Implement TikTok OAuth later
    console.log("TikTok OAuth will be implemented later");
  };

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-5 h-5" />;
      case "tiktok":
        return <Video className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const getTotalFollowers = () => {
    return socialMediaAccounts.reduce((total, account) => total + account.followers, 0);
  };

  if (loading) {
    return (
      <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-full">
              <Video className="w-6 h-6 text-teal-600" />
            </div>
            <h2 className="text-2xl font-semibold text-teal-600">Portfolio</h2>
          </div>
          {portfolioVideos.length < 4 && (
            <button
              onClick={() => setVideoModalOpen(true)}
              disabled={portfolioVideos.length >= 4}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
            >
              <Plus className="w-4 h-4" />
              Upload Video
            </button>
          )}
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

        {/* Portfolio Videos */}
        <div>
          {portfolioVideos.length > 0 ? (
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {portfolioVideos.map((videoUrl, index) => (
                  <div
                    key={index}
                    className="relative group bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 hover:border-teal-300 transition-colors"
                    style={{ width: '300px', height: '534px' }} // Much taller while maintaining 9:16 aspect ratio
                  >
                    {/* Video Preview */}
                    <video 
                      src={videoUrl} 
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                    />
                    
                    {/* Delete button overlay */}
                    <button
                      onClick={() => handleDeleteClick(videoUrl, index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    
                    {/* Video number badge */}
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                      {index + 1}
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
      </section>

      <VideoUploadModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        onUpload={uploadPortfolioVideo}
      />

      <InstagramConnectModal
        isOpen={instagramModalOpen}
        onClose={() => setInstagramModalOpen(false)}
        onConnect={handleInstagramConnect}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        videoIndex={videoToDelete?.index || 0}
      />
    </>
  );
};

export default SocialMediaSection;
