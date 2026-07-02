const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const { Sequelize } = require('sequelize');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  }
});

pool.on('connect', () => {
  console.log('PostgreSQL Database connected successfully (pg)');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  }
});

sequelize.authenticate()
  .then(() => console.log('Sequelize connected successfully'))
  .catch(err => console.error('Unable to connect to the database with Sequelize:', err));

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  sequelize,
};
