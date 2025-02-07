const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// Define routes
router.get('/jobs', jobController.getAllJobs);
router.post('/searchjobs', jobController.getSearchJobs);
router.get('/recommendation', jobController.getRecommendations);
router.post('/searchindustry', jobController.getSearchIndustry);
router.get('/filteredJobs', jobController.getJobs);
router.get('/:jobId', jobController.getJob);

module.exports = router;
