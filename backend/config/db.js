const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Verify dotenv is loaded correctly
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is missing. The server cannot start without a valid database connection string.');
  process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Required for Neon PostgreSQL
    },
  },
  logging: false, // Set to console.log to see SQL queries
});

module.exports = {
  sequelize,
};
