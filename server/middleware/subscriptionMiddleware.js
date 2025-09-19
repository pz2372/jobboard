const jwt = require('jsonwebtoken');

// Middleware to verify subscription token
const verifySubscriptionToken = (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.subscriptionToken;
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No subscription token provided' 
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add subscription data to request object
    req.subscription = {
      employerId: decoded.employerId,
      planType: decoded.planType,
      status: decoded.status,
      features: decoded.features,
      limitations: decoded.limitations,
      currentPeriodEnd: decoded.currentPeriodEnd,
      stripeSubscriptionId: decoded.stripeSubscriptionId
    };

    next();
  } catch (error) {
    console.error('Subscription token verification failed:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Subscription token expired',
        error: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid subscription token',
        error: 'INVALID_TOKEN'
      });
    }

    return res.status(500).json({ 
      success: false,
      message: 'Error verifying subscription token' 
    });
  }
};

// Middleware to check subscription status
const requireActiveSubscription = (req, res, next) => {
  if (!req.subscription) {
    return res.status(401).json({
      success: false,
      message: 'Subscription information not available'
    });
  }

  if (req.subscription.status !== 'active') {
    return res.status(403).json({
      success: false,
      message: 'Active subscription required',
      status: req.subscription.status
    });
  }

  // Check if subscription period has ended
  const currentPeriodEnd = new Date(req.subscription.currentPeriodEnd);
  const now = new Date();
  
  if (currentPeriodEnd < now) {
    return res.status(403).json({
      success: false,
      message: 'Subscription period has ended',
      error: 'SUBSCRIPTION_EXPIRED'
    });
  }

  next();
};

// Middleware to check specific feature access
const requireFeature = (requiredFeature) => {
  return (req, res, next) => {
    if (!req.subscription) {
      return res.status(401).json({
        success: false,
        message: 'Subscription information not available'
      });
    }

    const hasFeature = req.subscription.features.includes(requiredFeature);
    
    if (!hasFeature) {
      return res.status(403).json({
        success: false,
        message: `Feature '${requiredFeature}' not available in current plan`,
        currentPlan: req.subscription.planType
      });
    }

    next();
  };
};

// Middleware to check resource limits
const checkLimit = (limitType) => {
  return (req, res, next) => {
    if (!req.subscription) {
      return res.status(401).json({
        success: false,
        message: 'Subscription information not available'
      });
    }

    const limit = req.subscription.limitations[limitType];
    
    if (limit !== undefined) {
      req.subscriptionLimit = {
        type: limitType,
        value: limit
      };
    }

    next();
  };
};

module.exports = {
  verifySubscriptionToken,
  requireActiveSubscription,
  requireFeature,
  checkLimit
};
