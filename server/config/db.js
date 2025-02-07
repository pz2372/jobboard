require('dotenv').config(); 
const { Sequelize } = require('sequelize');

// Create a Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST || 'localhost',
  dialect: 'postgres',
  port: process.env.DATABASE_PORT || 5432,
  logging: false, // Set to true if you want to see SQL queries in the console
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = { sequelize, connectDB };