/**
 * Migration script to clean up sensitive data from localStorage
 * Run this once to remove any existing sensitive employer or subscription data
 */

console.log('🧹 Cleaning up sensitive data from localStorage...');

// List of keys that might contain sensitive data
const sensitiveKeys = [
  'employer_data', // Old key that might contain employer personal data
  'employer_profile',
  'employer_subscription',
  'employer_auth',
  'subscription_data'
];

let cleanedCount = 0;

sensitiveKeys.forEach(key => {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      
      // Check if it contains sensitive fields
      const hasSensitiveData = 
        parsed.employer || 
        parsed.subscription || 
        parsed.stripeCustomerId || 
        parsed.stripeSubscriptionId ||
        parsed.email ||
        parsed.phone ||
        parsed.address;
        
      if (hasSensitiveData) {
        // Remove the entire key if it contains sensitive data
        localStorage.removeItem(key);
        console.log(`🗑️  Removed sensitive data from key: ${key}`);
        cleanedCount++;
      } else if (key === 'employer_data') {
        // For employer_data, keep only jobs and applications
        const cleanData = {
          jobs: parsed.jobs || [],
          applications: parsed.applications || [],
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(cleanData));
        console.log(`✅ Cleaned employer_data key, kept only jobs and applications`);
        cleanedCount++;
      }
    } catch (error) {
      // If it's not JSON, just remove it to be safe
      localStorage.removeItem(key);
      console.log(`🗑️  Removed non-JSON data from key: ${key}`);
      cleanedCount++;
    }
  }
});

console.log(`🧹 Cleanup complete! Cleaned ${cleanedCount} items.`);
console.log('📊 Remaining localStorage keys:', Object.keys(localStorage));

// Log what remains in employer_data
const remainingData = localStorage.getItem('employer_data');
if (remainingData) {
  try {
    const parsed = JSON.parse(remainingData);
    console.log('📁 Remaining employer_data structure:', {
      jobs: parsed.jobs?.length || 0,
      applications: parsed.applications?.length || 0,
      lastUpdated: parsed.lastUpdated
    });
  } catch (error) {
    console.log('❌ Error parsing remaining employer_data');
  }
}
