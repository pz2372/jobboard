const express = require('express');
const { addSubscriber } = require('../controllers/subscriberController');

const router = express.Router();

// Route to add a new subscriber
router.post('/add', addSubscriber);

module.exports = router;
