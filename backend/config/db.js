const { Pool } = require('pg');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
const { URL } = require('url');

dotenv.config();

// Task 8: Exit immediately if DATABASE_URL is missing
if (!process.env.DATABASE_URL) {
  console.error('CRITICAL: DATABASE_URL is missing from environment variables. Exiting.');
  process.exit(1);
}

// Tasks 2, 3: Parse and log DATABASE_URL details
let parsedUrl;
try {
  parsedUrl = new URL(process.env.DATABASE_URL);
} catch (err) {
  console.error('CRITICAL: Failed to parse DATABASE_URL. Is it a valid URL?', err.message);
  process.exit(1);
}

console.log('--- Database Connection Audit ---');
console.log('DATABASE_URL exists? Yes');
console.log(`Parsed host: ${parsedUrl.hostname}`);
console.log(`Parsed port: ${parsedUrl.port}`);
console.log(`Parsed database name (pathname): ${parsedUrl.pathname.replace('/', '')}`);
console.log(`SSL enabled? ${process.env.DATABASE_URL.includes('sslmode=require') || process.env.NODE_ENV === 'production' ? 'Yes' : 'No'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
console.log('---------------------------------');

// Task 4, 5: Detect fallbacks and ensure we only use process.env.DATABASE_URL
if (['localhost', '127.0.0.1', '::1'].includes(parsedUrl.hostname) && process.env.NODE_ENV === 'production') {
  console.warn('WARNING: DATABASE_URL is pointing to localhost but NODE_ENV is production. This may cause ECONNREFUSED on Render.');
}
if (process.env.DB_HOST) {
  console.warn('WARNING: DB_HOST is set but we are strictly using DATABASE_URL in production.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('PostgreSQL Database connected successfully (pg)');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client');
  console.error(`Error code: ${err.code}`);
  console.error(`Address: ${err.address}`);
  console.error(`Port: ${err.port}`);
  console.error(`Errno: ${err.errno}`);
  console.error(`Stack: ${err.stack}`);
  process.exit(-1);
});

// Task 6: Verify Sequelize configuration for Neon PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

sequelize.authenticate()
  .then(() => {
    // Task 12: Add clear startup logs
    console.log(`Sequelize connected successfully to host: ${parsedUrl.hostname}, port: ${parsedUrl.port}`);
  })
  .catch(err => {
    console.error('Unable to connect to the database with Sequelize:');
    // Task 7: Print the original PostgreSQL connection error
    if (err.original) {
      console.error(`Error code: ${err.original.code}`);
      console.error(`Address: ${err.original.address}`);
      console.error(`Port: ${err.original.port}`);
      console.error(`Errno: ${err.original.errno}`);
    }
    console.error(`Stack: ${err.stack}`);
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  sequelize,
};
