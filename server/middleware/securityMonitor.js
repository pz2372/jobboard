const winston = require('winston');
const securityConfig = require('../config/security');

// Enhanced security logger
const securityLogger = winston.createLogger({
  level: securityConfig.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'security-monitor' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/security.log',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      level: 'warn'
    }),
    new winston.transports.File({ 
      filename: 'logs/security-all.log',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Security event types
const SECURITY_EVENTS = {
  SUSPICIOUS_REQUEST: 'SUSPICIOUS_REQUEST',
  FAILED_LOGIN: 'FAILED_LOGIN',
  MULTIPLE_FAILED_LOGINS: 'MULTIPLE_FAILED_LOGINS',
  SQL_INJECTION_ATTEMPT: 'SQL_INJECTION_ATTEMPT',
  XSS_ATTEMPT: 'XSS_ATTEMPT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  PRIVILEGE_ESCALATION: 'PRIVILEGE_ESCALATION',
  SUSPICIOUS_FILE_UPLOAD: 'SUSPICIOUS_FILE_UPLOAD'
};

// Suspicious patterns to detect
const suspiciousPatterns = {
  sql: [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b.*\b(FROM|INTO|SET|WHERE|VALUES)\b)/i,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
    /(\bUNION\b.*\bSELECT\b)/i,
    /(;.*--)/, // SQL comments after statements
    /(\bhex\(|char\(|ascii\(|substring\()/i // SQL functions often used in attacks
  ],
  xss: [
    /<script[^>]*>.*?<\/script>/i,
    /javascript:\s*[^;]+/i,
    /on\w+\s*=\s*[^;]+/i,
    /<iframe[^>]*>.*?<\/iframe>/i,
    /eval\s*\([^)]+\)/i,
    /expression\s*\([^)]+\)/i
  ],
  pathTraversal: [
    /\.\.\//,
    /\.\.\\/,
    /%2e%2e%2f/i,
    /%2e%2e%5c/i,
    /\.\.%2f/i,
    /\.\.%5c/i
  ]
};

// Security monitoring middleware
const securityMonitor = (req, res, next) => {
  // Check if security monitoring is enabled
  if (process.env.SECURITY_MONITORING_ENABLED !== 'true') {
    // Security monitoring is disabled
    return next();
  }

  // Skip security monitoring for certain safe endpoints
  const safeEndpoints = [
    '/health',
    '/favicon.ico',
    '/uploads/',
    '/',
  ];
  
  const isSafeEndpoint = safeEndpoints.some(endpoint => req.url.startsWith(endpoint));
  if (isSafeEndpoint) {
    return next();
  }

  const requestData = {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    headers: { ...req.headers, cookie: '[REDACTED]', authorization: '[REDACTED]' }, // Redact sensitive headers
    body: req.body
  };

  // Create sanitized request string for pattern detection (exclude cookies and auth headers)
  const requestForAnalysis = {
    url: req.url,
    query: req.query,
    body: req.body,
    headers: {
      ...req.headers,
      cookie: undefined, // Don't analyze cookies for SQL injection
      authorization: undefined, // Don't analyze auth headers
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type']
    }
  };
  
  const requestString = JSON.stringify(requestForAnalysis);

  // SQL injection detection (more precise patterns)
  let sqlDetected = false;
  for (const pattern of suspiciousPatterns.sql) {
    if (pattern.test(requestString)) {
      // Additional validation - check if it's in actual user input, not just presence
      const bodyString = JSON.stringify(req.body || {});
      const queryString = JSON.stringify(req.query || {});
      
      if (pattern.test(bodyString) || pattern.test(queryString)) {
        securityLogger.warn('Potential SQL injection attempt detected', {
          event: SECURITY_EVENTS.SQL_INJECTION_ATTEMPT,
          pattern: pattern.toString(),
          location: pattern.test(bodyString) ? 'body' : 'query',
          ...requestData
        });
        sqlDetected = true;
        break;
      }
    }
  }

  // XSS detection (only in user input)
  const userInputString = JSON.stringify({ body: req.body, query: req.query });
  for (const pattern of suspiciousPatterns.xss) {
    if (pattern.test(userInputString)) {
      securityLogger.warn('Potential XSS attempt detected', {
        event: SECURITY_EVENTS.XSS_ATTEMPT,
        pattern: pattern.toString(),
        ...requestData
      });
      break;
    }
  }

  // Path traversal detection
  for (const pattern of suspiciousPatterns.pathTraversal) {
    if (pattern.test(requestString)) {
      securityLogger.warn('Potential path traversal attempt detected', {
        event: SECURITY_EVENTS.SUSPICIOUS_REQUEST,
        pattern: pattern.toString(),
        ...requestData
      });
      break;
    }
  }

  // Suspicious user agent detection
  const suspiciousUserAgents = [
    /sqlmap/i,
    /nikto/i,
    /nmap/i,
    /masscan/i,
    /zap/i,
    /burp/i,
    /curl.*bot/i
  ];

  const userAgent = req.get('User-Agent') || '';
  for (const pattern of suspiciousUserAgents) {
    if (pattern.test(userAgent)) {
      securityLogger.warn('Suspicious user agent detected', {
        event: SECURITY_EVENTS.SUSPICIOUS_REQUEST,
        userAgent,
        ...requestData
      });
      break;
    }
  }

  // Check for unusual request patterns
  if (req.url.length > 1000) {
    securityLogger.warn('Unusually long URL detected', {
      event: SECURITY_EVENTS.SUSPICIOUS_REQUEST,
      urlLength: req.url.length,
      ...requestData
    });
  }

  // Log security events for analysis (but not all requests)
  if (req.method === 'POST' && (req.url.includes('login') || req.url.includes('signup'))) {
    securityLogger.info('Authentication attempt', {
      event: 'AUTH_ATTEMPT',
      ...requestData,
      body: { ...req.body, password: '[REDACTED]' } // Don't log passwords
    });
  }

  // Log suspicious activity only
  if (sqlDetected || req.url.length > 1000 || suspiciousUserAgents.some(pattern => pattern.test(userAgent))) {
    securityLogger.info('Request flagged for review', {
      event: 'FLAGGED_REQUEST',
      ...requestData
    });
  }

  next();
};

// Function to log security events from other middleware
const logSecurityEvent = (event, data) => {
  securityLogger.warn('Security event', {
    event,
    timestamp: new Date().toISOString(),
    ...data
  });
};

// Function to log failed authentication attempts
const logFailedAuth = (req, reason) => {
  securityLogger.warn('Authentication failed', {
    event: SECURITY_EVENTS.FAILED_LOGIN,
    reason,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    url: req.url,
    timestamp: new Date().toISOString()
  });
};

// Function to log successful authentication
const logSuccessfulAuth = (req, userId, userType) => {
  securityLogger.info('Authentication successful', {
    event: 'SUCCESSFUL_LOGIN',
    userId,
    userType,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  securityMonitor,
  logSecurityEvent,
  logFailedAuth,
  logSuccessfulAuth,
  SECURITY_EVENTS
};
