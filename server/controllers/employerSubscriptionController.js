const { EmployerSubscription, EmployerAccount } = require('../models');
const stripeService = require('../config/stripeService');
const checkAuth = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

// Plan configurations (matching frontend)
const PLAN_CONFIGS = {
  basic: {
    name: 'Basic',
    monthlyPrice: 79,
    annualPrice: 840, // 70 * 12
    stripePriceId: {
      monthly: 'price_1RkuWmB7EyGuytNsmD8KU8TZ',
      annual: 'price_1RkuWmB7EyGuytNs4hclLYhY'  
    },
    features: [
      'Only 1 job post per month',
      'Basic applicant tracking',
      'Email notifications',
      'Standard job visibility',
      'Basic analytics'
    ],
    limitations: [
      'Limited to 20 applicants per job',
      'Direct support 24/7'
    ],
    annualSaveAmount: 192
  },
  impact: {
    name: 'Impact',
    monthlyPrice: 149,
    annualPrice: 1620, // 135 * 12
    stripePriceId: {
      monthly: 'price_1RkuXZB7EyGuytNspEPVDafF', 
      annual: 'price_1RkuXGB7EyGuytNsbeId2ggv' 
    },
    features: [
      '2 job posts per month',
      'Advanced applicant tracking',
      'Priority job placement',
      'Detailed analytics dashboard',
      'Custom application forms',
      'Access AI candidate suggestions',
      'Direct support 24/7'
    ],
    limitations: ['Limited to 200 applicants per job'],
    annualSaveAmount: 312
  },
  accelerate: {
    name: 'Accelerate',
    monthlyPrice: 219,
    annualPrice: 2400, // 200 * 12
    stripePriceId: {
      monthly: 'price_1RkuYiB7EyGuytNshfUUwdDy',
      annual: 'price_1RkuY4B7EyGuytNsCMPzWw1u' 
    },
    features: [
      '3 job posts per month',
      'Premium applicant tracking',
      'Featured job listings',
      'Advanced analytics & reporting',
      'Custom branding',
      'Bulk actions & automation',
      'Priority support',
      'Access AI candidate suggestions',
      'Team collaboration tools'
    ],
    annualSaveAmount: 396
  },
  corporate: {
    name: 'Corporate',
    monthlyPrice: 399,
    annualPrice: 4308, // 359 * 12
    stripePriceId: {
      monthly: 'price_1RkuZhB7EyGuytNsjloAPtRz', 
      annual: 'price_1RkuZOB7EyGuytNsD516WooR'  
    },
    features: [
      '8 job posts per month',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced security features',
      'Multi-location management',
      'White-label solutions',
      'Custom reporting',
      '24/7 phone support',
      'Onboarding assistance',
      'SLA guarantees'
    ],
    annualSaveAmount: 720
  }
};

//********** Get current subscription for an employer
// Helper function to generate subscription token
const generateSubscriptionToken = (subscriptionData) => {
  const tokenPayload = {
    employerId: subscriptionData.employerId,
    planType: subscriptionData.planType,
    status: subscriptionData.status,
    features: PLAN_CONFIGS[subscriptionData.planType]?.features || [],
    limitations: PLAN_CONFIGS[subscriptionData.planType]?.limitations || {},
    currentPeriodEnd: subscriptionData.currentPeriodEnd,
    stripeSubscriptionId: subscriptionData.stripeSubscriptionId,
    iat: Math.floor(Date.now() / 1000)
  };

  return jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: '24h' // Subscription token expires in 24 hours
  });
};

exports.getCurrentSubscription = async (req, res) => {
  try {
    const { employerId } = req.params;

    const subscription = await EmployerSubscription.findOne({
      where: { employerId },
      include: [{
        model: EmployerAccount,
        as: 'employer',
        attributes: ['id', 'companyName', 'email']
      }]
    });

    if (!subscription) {
      return res.status(200).json({ 
        message: 'Employer does not have a subscription',
        hasSubscription: false
      });
    }

    // Add plan details to response
    const planDetails = PLAN_CONFIGS[subscription.planType] || null;

    // Generate subscription token
    const subscriptionToken = generateSubscriptionToken(subscription);

    // Set subscription token as httpOnly cookie
    res.cookie("subscriptionToken", subscriptionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(200).json({
      success: true,
      subscription: {
        ...subscription.toJSON(),
        planDetails
      },
      subscriptionToken, // Also return in response for client-side storage if needed
      hasSubscription: true
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ 
      message: 'Error fetching subscription',
      error: error.message 
    });
  }
};

// Refresh subscription token endpoint
exports.refreshSubscriptionToken = async (req, res) => {
  try {
    const employerId = req.user?.id; // From auth middleware

    if (!employerId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    const subscription = await EmployerSubscription.findOne({
      where: { employerId }
    });

    if (!subscription) {
      return res.status(404).json({ 
        success: false,
        message: 'No subscription found',
        hasSubscription: false
      });
    }

    // Generate new subscription token
    const subscriptionToken = generateSubscriptionToken(subscription);

    // Set new subscription token as httpOnly cookie
    res.cookie("subscriptionToken", subscriptionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(200).json({
      success: true,
      message: 'Subscription token refreshed',
      subscriptionToken
    });
  } catch (error) {
    console.error('Error refreshing subscription token:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error refreshing subscription token',
      error: error.message 
    });
  }
};


//********** Create new subscription
exports.createSubscription = async (req, res) => {
  try {
    const {
      employerId,
      planType,
      billingCycle
    } = req.body;

    // Validate plan type
    if (!PLAN_CONFIGS[planType]) {
      return res.status(400).json({ 
        message: 'Invalid plan type',
        validPlans: Object.keys(PLAN_CONFIGS)
      });
    }

    // Check if employer exists
    const employer = await EmployerAccount.findByPk(employerId);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    // Get Stripe Price ID based on billing cycle
    const stripePriceId = PLAN_CONFIGS[planType].stripePriceId[billingCycle];

    // Create Stripe Checkout Session
    const lineItems = [
      {
        price: stripePriceId, // Stripe Price ID
        quantity: 1,
      },
    ];

    const session = await stripeService.createCheckoutSession(lineItems);

    if (!session.url) {
      return res.status(500).json({ message: 'Failed to create Stripe Checkout session' });
    }

    // Save subscription info to the database
    const planConfig = PLAN_CONFIGS[planType];
    const amount = billingCycle === 'annual' ? planConfig.annualPrice : planConfig.monthlyPrice;

    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date();
    if (billingCycle === 'annual') {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
    } else {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    }

    const subscription = await EmployerSubscription.create({
      employerId,
      planType,
      billingCycle,
      amount,
      currentPeriodStart,
      currentPeriodEnd,
      stripePriceId,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully and Stripe Checkout session initiated',
      checkoutUrl: session.url,
      subscription: subscription.toJSON()
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ 
      message: 'Error creating subscription',
      error: error.message 
    });
  }
};

//*********** Update subscription (e.g., change plan, billing cycle)
exports.updateSubscription = async (req, res) => {
  try {
    const { employerId } = req.params;
    const {
      planType,
      billingCycle,
      status,
      stripeSubscriptionId,
      stripePriceId,
      cancelAtPeriodEnd
    } = req.body;

    const subscription = await EmployerSubscription.findOne({
      where: { employerId }
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Validate plan type if provided
    if (planType && !PLAN_CONFIGS[planType]) {
      return res.status(400).json({ 
        message: 'Invalid plan type',
        validPlans: Object.keys(PLAN_CONFIGS)
      });
    }

    const updateData = {};
    
    if (planType) {
      updateData.planType = planType;
      const planConfig = PLAN_CONFIGS[planType];
      updateData.amount = billingCycle === 'annual' ? planConfig.annualPrice : planConfig.monthlyPrice;
    }
    
    if (billingCycle) updateData.billingCycle = billingCycle;
    if (status) updateData.status = status;
    if (stripeSubscriptionId) updateData.stripeSubscriptionId = stripeSubscriptionId;
    if (stripePriceId) updateData.stripePriceId = stripePriceId;
    if (cancelAtPeriodEnd !== undefined) updateData.cancelAtPeriodEnd = cancelAtPeriodEnd;
 
    await subscription.update(updateData);

    const updatedSubscription = await EmployerSubscription.findOne({
      where: { employerId },
      include: [{
        model: EmployerAccount,
        as: 'employer',
        attributes: ['id', 'companyName', 'email']
      }]
    });

    const planDetails = PLAN_CONFIGS[updatedSubscription.planType] || null;

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      subscription: {
        ...updatedSubscription.toJSON(),
        planDetails
      }
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ 
      message: 'Error updating subscription',
      error: error.message 
    });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const { employerId } = req.params;
    const { immediate = false } = req.body;

    const subscription = await EmployerSubscription.findOne({
      where: { employerId }
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    const updateData = {
      cancelAtPeriodEnd: !immediate,
      cancelledAt: new Date()
    };

    if (immediate) {
      updateData.status = 'cancelled';
    }

    await subscription.update(updateData);

    res.status(200).json({
      success: true,
      message: immediate ? 'Subscription cancelled immediately' : 'Subscription will be cancelled at period end',
      subscription: subscription.toJSON()
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ 
      message: 'Error cancelling subscription',
      error: error.message 
    });
  }
};

// Reactivate cancelled subscription
exports.reactivateSubscription = async (req, res) => {
  try {
    const { employerId } = req.params;

    const subscription = await EmployerSubscription.findOne({
      where: { employerId }
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    if (subscription.status !== 'cancelled' && !subscription.cancelAtPeriodEnd) {
      return res.status(400).json({ message: 'Subscription is already active' });
    }

    await subscription.update({
      status: 'active',
      cancelAtPeriodEnd: false,
      cancelledAt: null
    });

    const updatedSubscription = await EmployerSubscription.findOne({
      where: { employerId },
      include: [{
        model: EmployerAccount,
        as: 'employer',
        attributes: ['id', 'companyName', 'email']
      }]
    });

    const planDetails = PLAN_CONFIGS[updatedSubscription.planType] || null;

    res.status(200).json({
      success: true,
      message: 'Subscription reactivated successfully',
      subscription: {
        ...updatedSubscription.toJSON(),
        planDetails
      }
    });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    res.status(500).json({ 
      message: 'Error reactivating subscription',
      error: error.message 
    });
  }
};

// Get all available plans
exports.getPlans = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      plans: PLAN_CONFIGS
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ 
      message: 'Error fetching plans',
      error: error.message 
    });
  }
};

// Get subscription history for an employer
exports.getSubscriptionHistory = async (req, res) => {
  try {
    const { employerId } = req.params;

    // This would typically include historical records
    // For now, we'll return the current subscription with created/updated info
    const subscription = await EmployerSubscription.findOne({
      where: { employerId },
      include: [{
        model: EmployerAccount,
        as: 'employer',
        attributes: ['id', 'companyName', 'email']
      }]
    });

    if (!subscription) {
      return res.status(404).json({ 
        message: 'No subscription found for this employer',
        history: []
      });
    }

    res.status(200).json({
      success: true,
      history: [subscription.toJSON()] // In a real app, this would be multiple records
    });
  } catch (error) {
    console.error('Error fetching subscription history:', error);
    res.status(500).json({ 
      message: 'Error fetching subscription history',
      error: error.message 
    });
  }
};

module.exports = {
  getCurrentSubscription: exports.getCurrentSubscription,
  createSubscription: exports.createSubscription,
  updateSubscription: exports.updateSubscription,
  cancelSubscription: exports.cancelSubscription,
  reactivateSubscription: exports.reactivateSubscription,
  getPlans: exports.getPlans,
  getSubscriptionHistory: exports.getSubscriptionHistory,
  refreshSubscriptionToken: exports.refreshSubscriptionToken,
  PLAN_CONFIGS
};
