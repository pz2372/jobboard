const express = require('express');
const router = express.Router();
const employerSubscriptionController = require('../controllers/employerSubscriptionController');
const checkAuth = require('../middleware/authMiddleware');

// Public routes
router.get('/plans', employerSubscriptionController.getPlans);

// Protected routes (require authentication)
// Get current subscription for an employer
router.get('/:employerId', checkAuth, employerSubscriptionController.getCurrentSubscription);

// Create new subscription
router.post('/', checkAuth, employerSubscriptionController.createSubscription);

// Update subscription
router.put('/:employerId', checkAuth, employerSubscriptionController.updateSubscription);

// Cancel subscription
router.patch('/:employerId/cancel', checkAuth, employerSubscriptionController.cancelSubscription);

// Reactivate subscription
router.patch('/:employerId/reactivate', checkAuth, employerSubscriptionController.reactivateSubscription);

// Get subscription history
router.get('/:employerId/history', checkAuth, employerSubscriptionController.getSubscriptionHistory);

// Refresh subscription token
router.post('/refresh-token', checkAuth, employerSubscriptionController.refreshSubscriptionToken);

module.exports = router;
