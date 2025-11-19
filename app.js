require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const serverConfig = require('./config/serverConfig');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Connect to MongoDB only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/belajar-nodejs';
  mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Middleware
app.use(bodyParser.json());
app.use(express.json()); 
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'UP' }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Not Found',
    error: {
      statusCode: 404,
      message: 'The requested resource was not found on this server'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error:', err);
  }
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({ 
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
  });
}

module.exports = app;