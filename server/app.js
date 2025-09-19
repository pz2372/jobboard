const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const { connectDB } = require('./config/db');
const securityConfig = require('./config/security');
const { securityMonitor } = require('./middleware/securityMonitor');
const { validateEnvironment } = require('./config/envValidator');

// Validate environment variables on startup
const envValidation = validateEnvironment();
if (!envValidation.valid && process.env.NODE_ENV === 'production') {
  console.error('❌ Critical environment validation failed in production');
  process.exit(1);
}

const userAccountRoutes = require('./routes/userAccountRoutes');
const employerAccountRoutes = require('./routes/employerAccountRoutes');
const employerSubscriptionRoutes = require('./routes/employerSubscriptionRoutes');
const employerApplicationsRoutes = require('./routes/employerApplicationRoutes');
const jobRoutes = require('./routes/jobRoutes');
const employerJobRoutes = require('./routes/employerJobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const userSocialMediaRoutes = require('./routes/userSocialMediaRoutes');
const savedJobRoutes = require('./routes/savedJobRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const passwordRoutes = require('./routes/passwordRoutes');

const app = express();

// Security logging setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'jobs-board-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Rate limiting configurations
const generalLimiter = rateLimit({
  windowMs: securityConfig.rateLimiting.general.windowMs,
  max: securityConfig.rateLimiting.general.max,
  message: {
    error: securityConfig.rateLimiting.general.message
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: securityConfig.rateLimiting.auth.windowMs,
  max: securityConfig.rateLimiting.auth.max,
  message: {
    error: securityConfig.rateLimiting.auth.message
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordResetLimiter = rateLimit({
  windowMs: securityConfig.rateLimiting.passwordReset.windowMs,
  max: securityConfig.rateLimiting.passwordReset.max,
  message: {
    error: securityConfig.rateLimiting.passwordReset.message
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// State to track DB connection
let isDbConnected = false;

// Security middleware
app.use(helmet(securityConfig.helmet));

// Apply general rate limiting to all requests
app.use(generalLimiter);

// Security monitoring middleware (controlled by environment variable)
app.use(securityMonitor);

// Security logging middleware (only for significant events)
app.use((req, res, next) => {
  // Only log authentication, errors, and POST/PUT/DELETE requests
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE' || 
      req.url.includes('login') || req.url.includes('signup') || req.url.includes('password')) {
    logger.info('Significant request', {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
  }
  next();
});

// Middleware
app.use(express.json({ limit: '10mb' })); // Limit JSON payload size
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // Specific to React frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true  // Allow credentials (cookies, auth headers)
}));

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

// Connect to DB before handling requests
app.use(async (req, res, next) => {
  if (!isDbConnected) {
    try {
      await connectDB();
      isDbConnected = true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return res.status(500).json({ message: 'Database connection failed' });
    }
  }
  next();
});

connectDB();


app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Apply specific rate limiters to authentication routes
app.use('/user/login', authLimiter);
app.use('/user/signup', authLimiter);
app.use('/employer/login', authLimiter);
app.use('/employer/signup', authLimiter);
app.use('/password/forgot-password', passwordResetLimiter);
app.use('/password/reset-password', passwordResetLimiter);

// Routes
app.use('/user', userAccountRoutes);
app.use('/employer', employerAccountRoutes);
app.use('/employer-subscriptions', employerSubscriptionRoutes);
app.use('/jobs', jobRoutes);
app.use('/employerapplications', employerApplicationsRoutes);
app.use('/employerjobs', employerJobRoutes);
app.use('/applications', applicationRoutes);
app.use('/userprofile', userProfileRoutes);
app.use('/user-social-media', userSocialMediaRoutes);
app.use('/savedjobs', savedJobRoutes);
app.use('/settings', settingsRoutes);
app.use('/password', passwordRoutes);

// Health check with DB status check
app.get('/health', async (req, res) => {
  try {
    // You could check DB status more thoroughly here if desired
    if (isDbConnected) {
      res.status(200).json({ status: 'healthy', dbConnected: true });
    } else {
      res.status(500).json({ status: 'unhealthy', dbConnected: false });
    }
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', message: error.message });
  }
});

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
  console.log(`Security Monitoring: ${process.env.SECURITY_MONITORING_ENABLED === 'true' ? '✅ ENABLED' : '❌ DISABLED'}`);
});


// Global error handler with security logging
app.use((err, req, res, next) => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  console.error(err.stack);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;
