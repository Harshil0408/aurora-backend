const { Sequelize } = require('sequelize');
const { DATABASE, DATABASEUSERNAMEPASSWORD, DATABASEUSERNAME, DATABASEHOST } = require('./config');

async function initializeDatabase() {
  const sequelize = new Sequelize('', DATABASEUSERNAME, DATABASEUSERNAMEPASSWORD, {
    host: DATABASEHOST,
    query: { raw: true },
    dialect: 'mysql',
    logging: false,
  });
  try {
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${DATABASE}\`;`);
  } catch (error) {
    console.log('Unable to create database', error);
  } finally {
    await sequelize.close();
  }
}

async function getDatabase() {
  await initializeDatabase();

  const database = new Sequelize(DATABASE, DATABASEUSERNAME, DATABASEUSERNAMEPASSWORD, {
    host: DATABASEHOST,
    query: { raw: true },
    dialect: 'mysql',
    logging: false,
  });

  console.log('Connection to the database has been established successfully.');
  return database;
}

module.exports = getDatabase;
