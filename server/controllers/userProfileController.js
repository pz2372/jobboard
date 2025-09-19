const { UserAccount, UserProfile } = require("../models");
const { uploadProfilePicture, uploadPortfolioVideo } = require("../utils/cloudinaryHelper");
const path = require("path");

// Create user profile
exports.createUserProfile = async (req, res) => {

  try {
    const { userId, bio, state, city, phoneNumber, education, currentPosition } = req.body;
    // Ensure the user exists
    const user = await UserAccount.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the profile already exists for the user
    const existingProfile = await UserProfile.findOne({ where: { userId } });
    if (existingProfile) {
      return res.status(400).json({ error: "User profile already exists" });
    }

    // Helper function to ensure array format
    const ensureArray = (value) => {
      if (value === null || value === undefined) return [];
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        // If it's a JSON string, try to parse it
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [value];
        } catch {
          // If not JSON, treat as single item
          return value.trim() === '' ? [] : [value];
        }
      }
      return [value]; // Convert single value to array
    };

    const extracurriculars = ensureArray(req.body.extracurriculars);
    const clubs = ensureArray(req.body.clubs);
    const hobbies = ensureArray(req.body.hobbies);
    const awards = ensureArray(req.body.awards);
    const volunteer = ensureArray(req.body.volunteer);
    const work = ensureArray(req.body.work);
    const educationArray = ensureArray(education);

    console.log('Creating profile with arrays:', {
      education: educationArray,
      extracurriculars,
      clubs,
      hobbies,
      awards,
      volunteer,
      work
    });

    const userProfile = await UserProfile.create({
      userId,
      bio,
      state,
      city,
      phoneNumber,
      education: educationArray,
      currentPosition,
      extracurriculars,
      clubs,
      hobbies,
      awards,
      work,
      volunteer,
    });

    res.status(201).json({
      message: "User profile created successfully",
      data: userProfile,
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const userProfile = await UserProfile.findOne({
      where: { userId: userId },
    });
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const updatedFields = req.body;

  try {
    console.log(`Updating profile for user ${userId} with fields:`, updatedFields);
    
    const userProfile = await UserProfile.findOne({
      where: { userId: userId },
    });
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log('Profile before update:', userProfile.toJSON());

    // Helper function to ensure array format
    const ensureArray = (value) => {
      if (value === null || value === undefined) return [];
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        // If it's a JSON string, try to parse it
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [value];
        } catch {
          // If not JSON, treat as single item
          return value.trim() === '' ? [] : [value];
        }
      }
      return [value]; // Convert single value to array
    };

    // Process array fields if they exist in the update
    const processedFields = { ...updatedFields };
    const arrayFields = ['education', 'extracurriculars', 'clubs', 'hobbies', 'awards', 'work', 'volunteer'];
    
    arrayFields.forEach(field => {
      if (processedFields[field] !== undefined) {
        processedFields[field] = ensureArray(processedFields[field]);
        console.log(`Processed ${field}:`, processedFields[field]);
      }
    });

    const [updatedRowsCount] = await UserProfile.update(processedFields, { 
      where: { userId: userId } 
    });
    
    console.log(`Updated ${updatedRowsCount} rows`);

    // Fetch the updated profile to return the latest data
    const updatedProfile = await UserProfile.findOne({
      where: { userId: userId },
    });

    console.log('Profile after update:', updatedProfile.toJSON());

    res.status(200).json({
      message: "Profile updated successfully",
      updatedProfile: updatedProfile, // Send back the actual updated profile
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Update user profile picture
exports.updateUserProfilePicture = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary using helper function
    const uploadResult = await uploadProfilePicture(req.file.buffer, userId);

    // Save file URL to database
    const userProfile = await UserProfile.findOne({
      where: { userId: userId },
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    await userProfile.update({ profileImage: uploadResult.url });

    // Fetch the updated profile to return the latest data
    const updatedProfile = await UserProfile.findOne({
      where: { userId: userId },
    });

    res.status(200).json({ 
      message: "Profile updated successfully",
      updatedProfile: updatedProfile,
      profileImage: uploadResult.url
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add portfolio video
exports.addPortfolioVideo = async (req, res) => {
  const { userId } = req.params;
  const { videoUrl } = req.body;

  try {
    if (!videoUrl || !videoUrl.trim()) {
      return res.status(400).json({ message: "Video URL is required" });
    }

    const userProfile = await UserProfile.findOne({
      where: { userId: userId },
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const currentVideos = userProfile.portfolioVideos || [];
    
    // Check if already at max limit (4 videos)
    if (currentVideos.length >= 4) {
      return res.status(400).json({ 
        message: "Maximum of 4 portfolio videos allowed" 
      });
    }

    // Check if URL already exists
    if (currentVideos.includes(videoUrl.trim())) {
      return res.status(400).json({ 
        message: "This video URL is already added" 
      });
    }

    const updatedVideos = [...currentVideos, videoUrl.trim()];

    await userProfile.update({ portfolioVideos: updatedVideos });

    res.status(200).json({
      message: "Portfolio video added successfully",
      videoUrl: videoUrl.trim(),
      totalVideos: updatedVideos.length
    });
  } catch (error) {
    console.error("Error adding portfolio video:", error);
    res.status(500).json({ message: "Error adding portfolio video" });
  }
};

// Remove portfolio video
exports.removePortfolioVideo = async (req, res) => {
  const { userId, videoUrl } = req.params;

  try {
    const userProfile = await UserProfile.findOne({
      where: { userId: userId },
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const currentVideos = userProfile.portfolioVideos || [];
    const decodedVideoUrl = decodeURIComponent(videoUrl);
    const updatedVideos = currentVideos.filter(url => url !== decodedVideoUrl);

    if (currentVideos.length === updatedVideos.length) {
      return res.status(404).json({ message: "Video not found" });
    }

    await userProfile.update({ portfolioVideos: updatedVideos });

    res.status(200).json({
      message: "Portfolio video removed successfully",
      totalVideos: updatedVideos.length
    });
  } catch (error) {
    console.error("Error removing portfolio video:", error);
    res.status(500).json({ message: "Error removing portfolio video" });
  }
};

// Upload portfolio video file
exports.uploadPortfolioVideo = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file provided" });
    }

    const userProfile = await UserProfile.findOne({
      where: { userId: userId },
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const currentVideos = userProfile.portfolioVideos || [];
    
    if (currentVideos.length >= 4) {
      return res.status(400).json({
        message: "Maximum of 4 portfolio videos allowed"
      });
    }

    // Upload to Cloudinary using helper function
    const uploadResult = await uploadPortfolioVideo(req.file.buffer, userId);
    const updatedVideos = [...currentVideos, uploadResult.url];

    await userProfile.update({ portfolioVideos: updatedVideos });

    res.status(200).json({
      message: "Portfolio video uploaded successfully",
      videoUrl: uploadResult.url,
      totalVideos: updatedVideos.length
    });
  } catch (error) {
    console.error("Error uploading portfolio video:", error);
    res.status(500).json({ message: "Error uploading portfolio video" });
  }
};

// Get portfolio videos
exports.getPortfolioVideos = async (req, res) => {
  const { userId } = req.params;

  try {
    const userProfile = await UserProfile.findOne({
      where: { userId: userId },
      attributes: ['portfolioVideos']
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.status(200).json({
      videos: userProfile.portfolioVideos || [],
      totalVideos: (userProfile.portfolioVideos || []).length
    });
  } catch (error) {
    console.error("Error fetching portfolio videos:", error);
    res.status(500).json({ message: "Error fetching portfolio videos" });
  }
};
