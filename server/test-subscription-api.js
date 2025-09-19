// Test file for Employer Subscription API endpoints
// This file can be used to test the subscription functionality

const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

// Test functions
async function testGetPlans() {
  try {
    console.log('Testing GET /employer-subscriptions/plans...');
    const response = await axios.get(`${BASE_URL}/employer-subscriptions/plans`);
    console.log('✅ Plans fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching plans:', error.response?.data || error.message);
  }
}

async function testCreateSubscription(employerId, planType = 'basic', billingCycle = 'monthly') {
  try {
    console.log(`Testing POST /employer-subscriptions (employerId: ${employerId})...`);
    const response = await axios.post(`${BASE_URL}/employer-subscriptions`, {
      employerId,
      planType,
      billingCycle
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE', // Replace with actual token
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Subscription created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating subscription:', error.response?.data || error.message);
  }
}

async function testGetCurrentSubscription(employerId) {
  try {
    console.log(`Testing GET /employer-subscriptions/${employerId}...`);
    const response = await axios.get(`${BASE_URL}/employer-subscriptions/${employerId}`, {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
      }
    });
    console.log('✅ Current subscription fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching current subscription:', error.response?.data || error.message);
  }
}

async function testUpdateSubscription(employerId, updateData) {
  try {
    console.log(`Testing PUT /employer-subscriptions/${employerId}...`);
    const response = await axios.put(`${BASE_URL}/employer-subscriptions/${employerId}`, updateData, {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE', // Replace with actual token
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Subscription updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating subscription:', error.response?.data || error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Employer Subscription API Tests...\n');
  
  // Test 1: Get plans (public endpoint)
  await testGetPlans();
  console.log('\n' + '='.repeat(50) + '\n');
  
  // For the following tests, you'll need:
  // 1. A valid employer ID from your database
  // 2. A valid JWT token for authentication
  
  const EMPLOYER_ID = 1; // Replace with actual employer ID
  
  // Test 2: Create subscription (requires auth)
  // await testCreateSubscription(EMPLOYER_ID, 'impact', 'monthly');
  // console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 3: Get current subscription (requires auth)
  // await testGetCurrentSubscription(EMPLOYER_ID);
  // console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 4: Update subscription (requires auth)
  // await testUpdateSubscription(EMPLOYER_ID, { planType: 'accelerate' });
  
  console.log('✨ Tests completed!');
  console.log('\n📝 Notes:');
  console.log('- Uncomment the authenticated tests after setting up valid employer ID and JWT token');
  console.log('- Make sure the server is running on http://localhost:4000');
  console.log('- The database should have the employer_subscriptions table created');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testGetPlans,
  testCreateSubscription,
  testGetCurrentSubscription,
  testUpdateSubscription
};
