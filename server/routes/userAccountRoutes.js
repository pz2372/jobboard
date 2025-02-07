const express = require('express');
const router = express.Router();
const userAccountController = require('../controllers/userAccountController');

router.post('/signup', userAccountController.createUserAccount);
router.post('/login', userAccountController.loginUserAccount);
router.post('/logout', userAccountController.logoutUserAccount);

module.exports = router;
