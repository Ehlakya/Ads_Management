const { Pool } = require('pg');
const dotenv = require('dotenv');

// 1. Ensure dotenv is loaded before anything else
dotenv.config();

const { Sequelize } = require('sequelize');

let pool;
let sequelize;

// Utility to safely log DB info without leaking passwords
const logDbInfo = () => {
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      console.log(`ℹ️  Using DATABASE_URL configuration (Production mode).`);
      console.log(`ℹ️  Connecting to Database Host: ${url.hostname} on Port: ${url.port || 5432}`);
    } catch (e) {
      console.log(`ℹ️  Using DATABASE_URL configuration (Invalid URL format).`);
    }
  } else {
    console.log(`ℹ️  Using individual DB_* environment variables (Local mode).`);
    console.log(`ℹ️  Connecting to Database Host: ${process.env.DB_HOST} on Port: ${process.env.DB_PORT}`);
  }
};

logDbInfo();

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  });

  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, 
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    }
  });
} else {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'postgres',
      port: process.env.DB_PORT,
      logging: false,
    }
  );
}

pool.on('connect', () => {
  console.log('✅ PostgreSQL Database connected successfully (pg Pool)');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle pg client:', err);
  process.exit(-1);
});

sequelize.authenticate()
  .then(() => console.log('✅ Sequelize connected successfully'))
  .catch(err => {
    console.error('❌ Unable to connect to the database with Sequelize:', err);
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  sequelize,
};
