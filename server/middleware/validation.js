const { body, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User account validation rules
const validateUserSignup = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters'),
  
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Employer account validation rules
const validateEmployerSignup = [
  body('companyName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Company name must be between 1 and 100 characters')
    .matches(/^[a-zA-Z0-9\s&.,'-]+$/)
    .withMessage('Company name contains invalid characters'),
  
  body('contactPersonName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Contact person name must be between 1 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Contact person name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters'),
  
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  
  body('phoneNumber')
    .optional()
    .matches(/^\+?[\d\s()-]+$/)
    .withMessage('Phone number format is invalid')
    .isLength({ max: 20 })
    .withMessage('Phone number must be less than 20 characters'),
  
  body('website')
    .optional()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Website must be a valid URL')
    .isLength({ max: 255 })
    .withMessage('Website URL must be less than 255 characters'),
  
  handleValidationErrors
];

const validateEmployerLogin = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Job validation rules
const validateJobCreation = [
  body('jobTitle')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Job title must be between 1 and 100 characters'),
  
  body('jobDescription')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Job description must be between 10 and 5000 characters'),
  
  body('jobLocation')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Job location must be between 1 and 100 characters'),
  
  body('salaryMin')
    .optional()
    .isInt({ min: 0, max: 10000000 })
    .withMessage('Minimum salary must be a positive number less than 10,000,000'),
  
  body('salaryMax')
    .optional()
    .isInt({ min: 0, max: 10000000 })
    .withMessage('Maximum salary must be a positive number less than 10,000,000'),
  
  body('jobType')
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'temporary'])
    .withMessage('Job type must be one of: full-time, part-time, contract, internship, temporary'),
  
  body('experienceLevel')
    .isIn(['entry-level', 'mid-level', 'senior-level', 'executive'])
    .withMessage('Experience level must be one of: entry-level, mid-level, senior-level, executive'),
  
  handleValidationErrors
];

// Password reset validation rules
const validateForgotPassword = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  handleValidationErrors
];

const validateResetPassword = [
  body('token')
    .isLength({ min: 1 })
    .withMessage('Reset token is required'),
  
  body('newPassword')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  
  handleValidationErrors
];

const validateUpdatePassword = [
  body('currentPassword')
    .isLength({ min: 1 })
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8, max: 128 })
    .withMessage('New password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  
  handleValidationErrors
];

// Application validation rules
const validateJobApplication = [
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Cover letter must be less than 2000 characters'),
  
  handleValidationErrors
];

module.exports = {
  validateUserSignup,
  validateUserLogin,
  validateEmployerSignup,
  validateEmployerLogin,
  validateJobCreation,
  validateForgotPassword,
  validateResetPassword,
  validateUpdatePassword,
  validateJobApplication,
  handleValidationErrors
};
