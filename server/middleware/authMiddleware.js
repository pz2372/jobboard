const jwt = require('jsonwebtoken');
const winston = require('winston');
const JWT_SECRET = process.env.JWT_SECRET;

// Security logger for auth middleware
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'auth-middleware' },
  transports: [
    new winston.transports.File({ filename: 'logs/auth.log' }),
    new winston.transports.Console()
  ]
});

const checkAuth = (req, res, next) => {
  // First try to get token from httpOnly cookie
  let token = req.cookies?.authToken;
  
  // Fallback to Authorization header for backward compatibility
  if (!token) {
    token = req.headers.authorization?.split(" ")[1];
  }
  
  if (!token) {
    logger.warn('Authentication failed: No token provided', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach the decoded user info to the request object
    
    logger.info('Authentication successful', {
      userId: decoded.userId,
      userType: decoded.userType,
      ip: req.ip,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });
    
    next();
  } catch (error) {
    logger.warn('Authentication failed: Invalid token', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = checkAuth;
