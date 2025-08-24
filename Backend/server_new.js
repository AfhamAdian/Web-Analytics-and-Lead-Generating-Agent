/**
 * Main Server File
 * Entry point for the Web Analytics and Lead Generation API
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/app');

// Import route modules
const analyticsRoutes = require('./routes/analytics');
const leadRoutes = require('./routes/leads');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

// Create Express application
const app = express();

// Middleware setup
app.use(morgan('dev')); // Logging middleware
app.use(cors(config.corsOptions)); // CORS middleware
app.use(express.json()); // JSON parsing middleware

// API Routes
app.use('/api', analyticsRoutes); // Analytics tracking routes
app.use('/api', leadRoutes); // Lead capture routes  
app.use('/api', authRoutes); // Authentication routes
app.use('/api', dashboardRoutes); // Dashboard and site management routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Web Analytics and Lead Generation API is running',
    timestamp: new Date().toISOString(),
    environment: config.environment
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: config.environment === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
const server = app.listen(config.port, () => {
  console.log(`🚀 Server running at http://localhost:${config.port}`);
  console.log(`📊 Environment: ${config.environment}`);
  console.log(`🔧 API Documentation: http://localhost:${config.port}/health`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
