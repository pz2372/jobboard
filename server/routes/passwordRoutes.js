const express = require("express");
const router = express.Router();
const { forgotPassword, resetPassword, updatePassword } = require("../controllers/passwordController");
const { validateForgotPassword, validateResetPassword, validateUpdatePassword } = require("../middleware/validation");

router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password", validateResetPassword, resetPassword);
router.put("/update-password/:userId", validateUpdatePassword, updatePassword);

module.exports = router;