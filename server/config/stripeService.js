const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (lineItems) => {
  try {
    return await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'subscription', // Changed mode to subscription
      success_url: `${process.env.DOMAIN}/employer`,
      cancel_url: `${process.env.DOMAIN}/employer/subscription`,
    });
  } catch (error) {
    console.error('Error creating Stripe Checkout session:', error);
    throw new Error('Stripe Checkout session creation failed');
  }
};

module.exports = {
  createCheckoutSession,
};