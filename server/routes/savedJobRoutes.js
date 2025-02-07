const express = require('express');
const router = express.Router();
const savedJobController = require('../controllers/savedJobController');

// Get saved jobs for a user
router.get('/:userId', savedJobController.getSavedJobs);

// Add saved job
router.post('/add', savedJobController.addSavedJob);

// Delete saved job
router.delete('/:userId/:jobId', savedJobController.deleteSavedJob);

module.exports = router;
