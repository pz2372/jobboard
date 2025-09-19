const winston = require('winston');

// Environment variables validator for security
const requiredEnvVars = [
  'JWT_SECRET',
  'DATABASE_NAME',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_HOST',
  'DATABASE_PORT'
];

const optionalEnvVars = [
  'NODE_ENV',
  'PORT',
  'CORS_ORIGIN',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS'
];

const securityEnvValidation = {
  JWT_SECRET: {
    minLength: 32,
    pattern: /^[A-Za-z0-9+/=_-]+$/,
    description: 'JWT_SECRET should be at least 32 characters long and contain only alphanumeric characters and +/=_-'
  }
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'env-validator' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Add file logging only if not in production
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.File({ filename: 'logs/env-validation.log' }));
}

const validateEnvironment = () => {
  const errors = [];
  const warnings = [];
  const missing = [];

  logger.info('Starting environment validation...');

  // Check required environment variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
      errors.push(`Missing required environment variable: ${envVar}`);
    } else {
      // Check specific security validation rules
      if (securityEnvValidation[envVar]) {
        const value = process.env[envVar];
        const rules = securityEnvValidation[envVar];

        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${envVar} must be at least ${rules.minLength} characters long`);
        }

        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${envVar} format is invalid. ${rules.description}`);
        }
      }
    }
  }

  // Check optional environment variables
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      warnings.push(`Optional environment variable not set: ${envVar}`);
    }
  }

  // Environment-specific checks
  if (process.env.NODE_ENV === 'production') {
    // Production-specific validations
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 64) {
      errors.push('In production, JWT_SECRET should be at least 64 characters long');
    }

    if (!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === '*') {
      warnings.push('In production, CORS_ORIGIN should be set to specific domains, not wildcard');
    }
  }

  // Log results
  if (errors.length > 0) {
    logger.error('Environment validation failed', { errors, missing });
    console.error('❌ Environment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    
    if (process.env.NODE_ENV === 'production') {
      process.exit(1); // Exit in production if critical env vars are missing
    }
  } else {
    logger.info('Environment validation passed');
    console.log('✅ Environment validation passed');
  }

  if (warnings.length > 0) {
    logger.warn('Environment warnings', { warnings });
    console.warn('⚠️  Environment warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    missing
  };
};

// Generate environment template
const generateEnvTemplate = () => {
  const template = [
    '# Environment Configuration Template',
    '# Copy this file to .env and fill in the values',
    '',
    '# Required Variables',
    ...requiredEnvVars.map(envVar => {
      const comment = securityEnvValidation[envVar] ? 
        ` # ${securityEnvValidation[envVar].description}` : '';
      return `${envVar}=${comment}`;
    }),
    '',
    '# Optional Variables',
    ...optionalEnvVars.map(envVar => `# ${envVar}=`),
    '',
    '# Production Recommendations',
    '# NODE_ENV=production',
    '# JWT_SECRET should be 64+ characters in production',
    '# CORS_ORIGIN should be specific domain(s), not "*"',
    '# Use strong database passwords',
    '# Enable SSL/TLS for database connections'
  ];

  return template.join('\n');
};

module.exports = {
  validateEnvironment,
  generateEnvTemplate,
  requiredEnvVars,
  optionalEnvVars
};
