// Database setup script for employer subscriptions
// This script will create the employer_subscriptions table if it doesn't exist

const { sequelize } = require('./config/db');
const models = require('./models');

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database for employer subscriptions...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync models (this will create tables if they don't exist)
    await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables
    console.log('✅ Database tables synchronized successfully.');
    
    console.log('🎉 Database setup completed!');
    console.log('\n📋 Tables that should now exist:');
    console.log('- employer_subscriptions');
    console.log('- employers (should already exist)');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Database connection closed.');
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
