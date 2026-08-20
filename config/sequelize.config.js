require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'production'}` });
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DATABASEUSERNAME || 'root',
    password: process.env.DATABASEUSERNAME_PASSWORD || '',
    database: process.env.DATABASE || 'aurora',
    host: process.env.DATABASEHOST || 'localhost',
    dialect: 'mysql',
  },
  local: {
    username: process.env.DATABASEUSERNAME || 'root',
    password: process.env.DATABASEUSERNAME_PASSWORD || '',
    database: process.env.DATABASE || 'aurora',
    host: process.env.DATABASEHOST || 'localhost',
    dialect: 'mysql',
  },
  production: {
    username: process.env.DATABASEUSERNAME || 'root',
    password: process.env.DATABASEUSERNAME_PASSWORD || '',
    database: process.env.DATABASE || 'aurora',
    host: process.env.DATABASEHOST || 'localhost',
    dialect: 'mysql',
  },
};
