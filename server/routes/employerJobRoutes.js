const express = require('express');
const router = express.Router();
const employerJobController = require('../controllers/employerJobController');
const employerApplicationController = require('../controllers/employerApplicationController');

// Create job
router.post('/createjob', employerJobController.createJob);

// Update job
router.put('/:jobId', employerJobController.updateJob);

// Delete job
router.delete('/:jobId', employerJobController.deleteJob);

// Get applications for a job
router.get('/application/:jobId', employerApplicationController.getApplications);

// Get jobs by employer
router.get('/jobs/:employerId', employerJobController.getJobsByEmployer);

module.exports = router;
