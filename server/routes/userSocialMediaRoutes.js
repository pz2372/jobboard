const express = require('express');
const router = express.Router();
const userSocialMediaController = require('../controllers/userSocialMediaController');

// Get all social media accounts for a user profile
router.get('/profile/:userProfileId', userSocialMediaController.getSocialMediaByUserProfile);

// Get social media summary/stats for a user profile
router.get('/profile/:userProfileId/summary', userSocialMediaController.getSocialMediaSummary);

// Add or update a social media account for a user profile
router.post('/profile/:userProfileId', userSocialMediaController.upsertSocialMedia);
router.put('/profile/:userProfileId', userSocialMediaController.upsertSocialMedia);

// Get specific social media account by ID
router.get('/:id', userSocialMediaController.getSocialMediaById);

// Update follower count for a specific social media account
router.patch('/:id/followers', userSocialMediaController.updateFollowerCount);

// Refresh access token for a social media account
router.post('/:id/refresh-token', userSocialMediaController.refreshAccessToken);

// Delete a social media account
router.delete('/:id', userSocialMediaController.deleteSocialMedia);

module.exports = router;
