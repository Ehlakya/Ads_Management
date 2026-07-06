const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { errorHandler } = require('./middleware/errorMiddleware');

// Initialize models and associations
require('./models');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize database
const { sequelize } = require('./config/db');

const startServer = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    
    // 7. Print startup logs
    console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode...`);
    console.log(`PORT configured: ${PORT}`);
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'Loaded' : 'Missing'}`);

    // 9. Ensure the server only starts listening after Sequelize successfully authenticates
    console.log('Authenticating database connection...');
    await sequelize.authenticate();
    console.log('Database connection authenticated successfully.');

    // Sync database (this will create/update tables to match models)
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully.');

    // Routes
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/users', require('./routes/userRoutes'));
    app.use('/api/ads', require('./routes/adsRoutes'));
    app.use('/api/quotations', require('./routes/quotationRoutes'));
    app.use('/api/sales', require('./routes/salesRoutes'));

    // Error handler
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    // 8. Improve the database connection error messages so the exact reason is logged
    console.error('CRITICAL ERROR: Failed to start the server due to database connection issue.');
    console.error('Exact Error Message:', error.message);
    if (error.original) {
      console.error('Original Error Detail:', error.original);
    }
    process.exit(1);
  }
};

startServer();
