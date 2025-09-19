const express = require('express');
const router = express.Router();
const employerAccountController = require('../controllers/employerAccountController');
const processFileUpload = require('../middleware/uploadMiddleware');
const checkAuth = require('../middleware/authMiddleware');
const { validateEmployerSignup, validateEmployerLogin } = require('../middleware/validation');

router.post('/signup', validateEmployerSignup, employerAccountController.createEmployerAccount);
router.post('/login', validateEmployerLogin, employerAccountController.loginEmployerAccount);
router.post('/logout', employerAccountController.logoutEmployerAccount);

router.get('/me', checkAuth, employerAccountController.getCurrentEmployer); 
router.get("/:id", employerAccountController.getEmployerProfile);
router.get("/getId/:companyName", employerAccountController.getEmployerId);

router.put('/update/:id', employerAccountController.updateEmployerAccount)
router.put('/updateLogo/:id', processFileUpload, employerAccountController.updateLogo)

module.exports = router;
