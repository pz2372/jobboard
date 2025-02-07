const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

router.put('/:userId', settingsController.updateUserSettings);

module.exports = router;
