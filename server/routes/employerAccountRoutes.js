const express = require('express');
const router = express.Router();
const employerAccountController = require('../controllers/employerAccountController');
const upload = require('../middleware/uploadMiddleware');

router.post('/signup', employerAccountController.createEmployerAccount);
router.post('/login', employerAccountController.loginEmployerAccount);

router.get("/:id", employerAccountController.getEmployerProfile);
router.get("/getId/:companyName", employerAccountController.getEmployerId);

router.put('/update/:id', employerAccountController.updateEmployerAccount)
router.put('/updateLogo/:id', upload.single('file'), employerAccountController.updateLogo)

module.exports = router;
