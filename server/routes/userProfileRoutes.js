const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');
const processFileUpload = require('../middleware/uploadMiddleware');
const videoUploadMiddleware = require('../middleware/videoUploadMiddleware');

router.post('/profile', userProfileController.createUserProfile);
router.get('/:userId', userProfileController.getUserProfile);
router.put('/:userId', userProfileController.updateUserProfile);
router.put('/picture/:userId', processFileUpload, userProfileController.updateUserProfilePicture);

// Portfolio video routes
router.get('/:userId/videos', userProfileController.getPortfolioVideos);
router.post('/:userId/videos', userProfileController.addPortfolioVideo);
router.post('/:userId/videos/upload', videoUploadMiddleware, userProfileController.uploadPortfolioVideo);
router.delete('/:userId/videos/:videoUrl', userProfileController.removePortfolioVideo);

module.exports = router;
