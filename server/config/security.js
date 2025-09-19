// Security configuration settings
const securityConfig = {
  // Password requirements
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    specialCharsPattern: '@$!%*?&'
  },

  // Rate limiting settings
  rateLimiting: {
    general: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // requests per window
      message: 'Too many requests from this IP, please try again later.'
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // login attempts per window
      message: 'Too many login attempts from this IP, please try again later.'
    },
    passwordReset: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 3, // password reset attempts per window
      message: 'Too many password reset attempts from this IP, please try again later.'
    }
  },

  // JWT settings
  jwt: {
    expiresIn: '24h',
    algorithm: 'HS256',
    issuer: 'jobs-board-api',
    audience: 'jobs-board-client'
  },

  // Session/Cookie settings
  session: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },

  // File upload settings
  fileUpload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  },

  // Input validation limits
  validation: {
    name: {
      minLength: 1,
      maxLength: 50,
      pattern: /^[a-zA-Z\s'-]+$/
    },
    email: {
      maxLength: 255
    },
    companyName: {
      minLength: 1,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s&.,'-]+$/
    },
    jobTitle: {
      minLength: 1,
      maxLength: 100
    },
    jobDescription: {
      minLength: 10,
      maxLength: 5000
    },
    phoneNumber: {
      maxLength: 20,
      pattern: /^\+?[\d\s()-]+$/
    },
    website: {
      maxLength: 255
    },
    salary: {
      min: 0,
      max: 10000000
    },
    coverLetter: {
      maxLength: 2000
    }
  },

  // Security headers
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false
  },

  // Logging settings
  logging: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    maxFiles: 10,
    maxSize: '10m',
    logRetentionDays: 30
  }
};

module.exports = securityConfig;
