const { UserAccount, UserProfile } = require("../models");
const s3Client = require("../config/awsConfig");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");

// Create user profile
exports.createUserProfile = async (req, res) => {

  try {
    const { userId, bio, location, phoneNumber } = req.body;
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

    const extracurriculars = req.body.extracurriculars;
    const clubs = req.body.clubs;
    const hobbies = req.body.hobbies;
    const awards = req.body.awards;
    const volunteer = req.body.volunteer;

    let profileImage;
    if (req.file) {
      const file = req.file;
      const fileExtension = path.extname(file.originalname);
      const fileName = `users/${userId}/${Date.now()}${fileExtension}`;

      // Upload to S3
      const params = {
        Bucket: "shiftlink",
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      await s3Client.send(new PutObjectCommand(params));
      profileImage = `https://shiftlink.s3.us-east-1.amazonaws.com/${fileName}`;
    }

    const userProfile = await UserProfile.create({
      userId,
      bio,
      profileImage,
      location,
      phoneNumber,
      extracurriculars,
      clubs,
      hobbies,
      awards,
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
    const userProfile = await UserProfile.findOne({
      where: { userId: userId },
    });
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    await UserProfile.update(updatedFields, { where: { userId: userId } });

    res.status(200).json({
      message: "Profile updated successfully",
      updatedProfile: userProfile, // Send back updated profile
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

    const file = req.file;
    const fileExtension = path.extname(file.originalname);
    const fileName = `users/${userId}/${Date.now()}${fileExtension}`;

    // Upload to S3
    const params = {
      Bucket: "shiftlink",
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(params));
    profileImage = `https://shiftlink.s3.us-east-1.amazonaws.com/${fileName}`;

    // Save file URL to database
    const userProfile = await UserProfile.findOne({
      where: { userId: userId },
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    await userProfile.update({ profileImage });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
