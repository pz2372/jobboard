const express = require('express');
const router = express.Router();
const userAccountController = require('../controllers/userAccountController');
const { validateUserSignup, validateUserLogin } = require('../middleware/validation');

router.post('/signup', validateUserSignup, userAccountController.createUserAccount);
router.post('/login', validateUserLogin, userAccountController.loginUserAccount);
router.post('/logout', userAccountController.logoutUserAccount);

module.exports = router;
