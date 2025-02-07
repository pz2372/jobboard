const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');
const upload = require('../middleware/uploadMiddleware');

router.post('/profile', upload.single('profileImage'), userProfileController.createUserProfile);
router.get('/:userId', userProfileController.getUserProfile);
router.put('/:userId', userProfileController.updateUserProfile);
router.put('/picture/:userId', upload.single('file'), userProfileController.updateUserProfilePicture);

module.exports = router;
