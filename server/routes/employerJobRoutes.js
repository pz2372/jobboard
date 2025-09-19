const express = require('express');
const router = express.Router();
const employerJobController = require('../controllers/employerJobController');
const employerApplicationController = require('../controllers/employerApplicationController');
const { validateJobCreation } = require('../middleware/validation');

// Create job
router.post('/createjob', validateJobCreation, employerJobController.createJob);

// Update job
router.put('/:jobId', validateJobCreation, employerJobController.updateJob);

// Delete job
router.delete('/:jobId', employerJobController.deleteJob);

// Get applications for a job
router.get('/application/:jobId', employerApplicationController.getApplications);

// Get jobs by employer
router.get('/jobs/:employerId', employerJobController.getJobsByEmployer);

// Get job posting usage for employer
router.get('/usage/:employerId', employerJobController.getJobPostingUsage);

// Check job posting limit for employer
router.get('/limit/:employerId', employerJobController.checkJobPostingLimit);

module.exports = router;
