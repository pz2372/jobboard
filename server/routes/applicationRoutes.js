const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { validateJobApplication } = require('../middleware/validation');

// Get all applications by user
router.get('/user/:userId', applicationController.getApplicationsByUser);

// Get application by jobId
router.get('/job/:jobId', applicationController.getApplicationByJobId);

// Add application answer by user
router.post('/addUserApplication', validateJobApplication, applicationController.createUserApplication);

// Get application answer by user
router.get('/getUserApplication/:applicationId/:userId', applicationController.getUserApplication);

// Get application answer by user_applicationid
router.get('/getUserApplicationById/:id', applicationController.getUserApplicationById);

// Apply for a job (efficient endpoint)
router.post('/job/:jobId/apply', validateJobApplication, applicationController.applyForJob);

module.exports = router;
