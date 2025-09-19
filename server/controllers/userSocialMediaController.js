const { UserSocialMedia, UserProfile } = require("../models");
const { Op } = require('sequelize');

// Get all social media accounts for a user profile
exports.getSocialMediaByUserProfile = async (req, res) => {
  try {
    const { userProfileId } = req.params;

    const socialMediaAccounts = await UserSocialMedia.findAll({
      where: { userProfileId },
      order: [['platform', 'ASC'], ['createdAt', 'DESC']]
    });

    res.status(200).json(socialMediaAccounts);
  } catch (error) {
    console.error("Error fetching social media accounts:", error);
    res.status(500).json({ message: "Error fetching social media accounts" });
  }
};

// Add or update a social media account
exports.upsertSocialMedia = async (req, res) => {
  try {
    const { userProfileId } = req.params;
    const {
      platform,
      handle,
      profileUrl,
      followers,
      accessToken,
      refreshToken,
      expiresAt
    } = req.body;

    // Validate required fields
    if (!platform || !handle) {
      return res.status(400).json({ 
        message: "Platform and handle are required" 
      });
    }

    // Check if user profile exists
    const userProfile = await UserProfile.findByPk(userProfileId);
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Upsert social media account (update if exists, create if not)
    const [socialMedia, created] = await UserSocialMedia.upsert({
      userProfileId,
      platform,
      handle,
      profileUrl,
      followers: followers || 0,
      lastUpdated: new Date(),
      accessToken,
      refreshToken,
      expiresAt
    }, {
      returning: true
    });

    const action = created ? "created" : "updated";
    res.status(created ? 201 : 200).json({
      message: `Social media account ${action} successfully`,
      socialMedia
    });
  } catch (error) {
    console.error("Error upserting social media account:", error);
    res.status(500).json({ message: "Error saving social media account" });
  }
};

// Update follower count for a specific social media account
exports.updateFollowerCount = async (req, res) => {
  try {
    const { id } = req.params;
    const { followers } = req.body;

    if (followers === undefined || followers < 0) {
      return res.status(400).json({ 
        message: "Valid follower count is required" 
      });
    }

    const socialMedia = await UserSocialMedia.findByPk(id);
    if (!socialMedia) {
      return res.status(404).json({ message: "Social media account not found" });
    }

    await socialMedia.update({
      followers,
      lastUpdated: new Date()
    });

    res.status(200).json({
      message: "Follower count updated successfully",
      socialMedia
    });
  } catch (error) {
    console.error("Error updating follower count:", error);
    res.status(500).json({ message: "Error updating follower count" });
  }
};

// Delete a social media account
exports.deleteSocialMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const socialMedia = await UserSocialMedia.findByPk(id);
    if (!socialMedia) {
      return res.status(404).json({ message: "Social media account not found" });
    }

    await socialMedia.destroy();

    res.status(200).json({ message: "Social media account deleted successfully" });
  } catch (error) {
    console.error("Error deleting social media account:", error);
    res.status(500).json({ message: "Error deleting social media account" });
  }
};

// Get social media account by ID
exports.getSocialMediaById = async (req, res) => {
  try {
    const { id } = req.params;

    const socialMedia = await UserSocialMedia.findByPk(id, {
      include: [
        {
          model: UserProfile,
          as: 'userProfile',
          attributes: ['id', 'userId']
        }
      ]
    });

    if (!socialMedia) {
      return res.status(404).json({ message: "Social media account not found" });
    }

    res.status(200).json(socialMedia);
  } catch (error) {
    console.error("Error fetching social media account:", error);
    res.status(500).json({ message: "Error fetching social media account" });
  }
};

// Get social media summary/stats for a user profile
exports.getSocialMediaSummary = async (req, res) => {
  try {
    const { userProfileId } = req.params;

    const socialMediaAccounts = await UserSocialMedia.findAll({
      where: { userProfileId },
      attributes: ['platform', 'handle', 'followers', 'lastUpdated']
    });

    const totalFollowers = socialMediaAccounts.reduce((sum, account) => sum + account.followers, 0);
    const platformCount = socialMediaAccounts.length;

    const summary = {
      totalFollowers,
      platformCount,
      platforms: socialMediaAccounts.map(account => ({
        platform: account.platform,
        handle: account.handle,
        followers: account.followers,
        lastUpdated: account.lastUpdated
      }))
    };

    res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching social media summary:", error);
    res.status(500).json({ message: "Error fetching social media summary" });
  }
};

// Refresh access token (placeholder for OAuth refresh logic)
exports.refreshAccessToken = async (req, res) => {
  try {
    const { id } = req.params;

    const socialMedia = await UserSocialMedia.findByPk(id);
    if (!socialMedia) {
      return res.status(404).json({ message: "Social media account not found" });
    }

    // TODO: Implement platform-specific token refresh logic
    // This would depend on the platform's OAuth implementation

    res.status(200).json({ 
      message: "Token refresh functionality to be implemented",
      platform: socialMedia.platform 
    });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    res.status(500).json({ message: "Error refreshing access token" });
  }
};
