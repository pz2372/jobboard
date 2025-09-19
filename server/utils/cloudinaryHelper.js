const { cloudinary } = require("../config/cloudinary");
const { Readable } = require('stream');

/**
 * Upload image to Cloudinary with optimizations
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {Object} options - Upload options
 * @param {string} options.folder - Cloudinary folder path
 * @param {string} options.publicId - Custom public ID (optional)
 * @param {Object} options.transformation - Image transformation settings
 * @param {string} options.resourceType - Resource type (image, video, auto)
 * @returns {Promise<string>} - Secure URL of uploaded file
 */
const uploadToCloudinary = async (fileBuffer, options = {}) => {
  const {
    folder = "uploads",
    publicId = null,
    transformation = [],
    resourceType = "image"
  } = options;

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: resourceType,
      folder: folder,
      transformation: transformation,
      quality: "auto:good",
      format: "auto"
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(new Error(`Upload failed: ${error.message}`));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            resourceType: result.resource_type
          });
        }
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    const bufferStream = Readable.from(fileBuffer);
    bufferStream.pipe(uploadStream);
  });
};

/**
 * Upload profile picture with face detection and crop
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} userId - User ID for naming
 * @returns {Promise<Object>} - Upload result with URL
 */
const uploadProfilePicture = async (fileBuffer, userId) => {
  return uploadToCloudinary(fileBuffer, {
    folder: "user_profiles",
    publicId: `user_${userId}_${Date.now()}`,
    transformation: [
      { width: 400, height: 400, crop: "fill", gravity: "face" },
      { quality: "auto:good" }
    ]
  });
};

/**
 * Upload company logo with optimization
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} companyId - Company ID for naming
 * @returns {Promise<Object>} - Upload result with URL
 */
const uploadCompanyLogo = async (fileBuffer, companyId) => {
  return uploadToCloudinary(fileBuffer, {
    folder: "company_logos",
    publicId: `company_${companyId}_${Date.now()}`,
    transformation: [
      { width: 200, height: 200, crop: "fit" },
      { background: "white" },
      { quality: "auto:good" }
    ]
  });
};

/**
 * Upload job image with optimization
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} jobId - Job ID for naming
 * @returns {Promise<Object>} - Upload result with URL
 */
const uploadJobImage = async (fileBuffer, jobId) => {
  return uploadToCloudinary(fileBuffer, {
    folder: "job_images",
    publicId: `job_${jobId}_${Date.now()}`,
    transformation: [
      { width: 800, height: 600, crop: "fill" },
      { quality: "auto:good" }
    ]
  });
};

/**
 * Upload portfolio video
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} userId - User ID for naming
 * @returns {Promise<Object>} - Upload result with URL
 */
const uploadPortfolioVideo = async (fileBuffer, userId) => {
  return uploadToCloudinary(fileBuffer, {
    folder: "portfolio_videos",
    publicId: `portfolio_${userId}_${Date.now()}`,
    resourceType: "video",
    transformation: [
      { width: 1280, height: 720, crop: "limit" },
      { quality: "auto:good" },
      { format: "mp4" }
    ]
  });
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of the file to delete
 * @param {string} resourceType - Resource type (image, video)
 * @returns {Promise<Object>} - Deletion result
 */
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    throw new Error(`Delete failed: ${error.message}`);
  }
};

module.exports = {
  uploadToCloudinary,
  uploadProfilePicture,
  uploadCompanyLogo,
  uploadJobImage,
  uploadPortfolioVideo,
  deleteFromCloudinary
};