const { Sequelize } = require('sequelize');
const { DATABASE, DATABASEUSERNAME, DATABASEUSERNAMEPASSWORD, DATABASEHOST } = require('./config');
const { logger } = require('./utils/logger');

async function initializeDatabase() {
  // Create a temporary Sequelize instance for connecting without a database
  const sequelize = new Sequelize('', DATABASEUSERNAME, DATABASEUSERNAMEPASSWORD, {
    host: DATABASEHOST,
    query: { raw: true },
    dialect: 'mysql',
    logging: false,
  });

  try {
    // Create the database if it doesn't exist
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${DATABASE}\`;`);
  } catch (error) {
    logger.error('Unable to create the database:', error);
  } finally {
    // Close the temporary connection
    await sequelize.close();
  }
}

// Initialize Sequelize with the actual database
const database = new Sequelize(DATABASE, DATABASEUSERNAME, DATABASEUSERNAMEPASSWORD, {
  host: DATABASEHOST,
  query: { raw: true },
  dialect: 'mysql',
  logging: false,
});

initializeDatabase();
module.exports = database;
