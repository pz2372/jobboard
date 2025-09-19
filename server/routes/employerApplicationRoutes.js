const express = require('express');
const router = express.Router();
const employerApplicationController = require('../controllers/employerApplicationController');

// Get application for a job
router.get('/:jobId', employerApplicationController.getApplications);

router.post('/create', employerApplicationController.createApplication)

// Get applied applications for employer
router.get('/employerAppliedApplications/:employerId', employerApplicationController.getEmployerAppliedApplications);

// Route to soft delete an applied job by user ID
router.delete('/:userId', employerApplicationController.deleteAppliedJob);

// Route to update an applied job (status, applicationId, etc.)
router.put('/:id', employerApplicationController.updateAppliedJob);

// Route to accept an application (specific route for accepting)
router.put('/accept/:id', employerApplicationController.acceptApplication);


module.exports = router;
