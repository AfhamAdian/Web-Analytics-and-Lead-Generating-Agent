/**
 * Main Server File
 * Entry point for the Web Analytics and Lead Generation API
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Create Express application
const app = express();

// Configuration (moved from config/app.js)
const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: '24h',
  
  // CORS configuration
  corsOptions: {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
  },

  // Environment
  environment: process.env.NODE_ENV || 'development',
  
  // Frontend tracking script configuration
  trackingScriptUrl: 'http://localhost:8080/track.js'
};

// Middleware setup
app.use(morgan('dev')); // Logging middleware
app.use(cors(config.corsOptions)); // CORS middleware
app.use(express.json()); // JSON parsing middleware

// Load routes with error handling
try {
  // Analytics tracking routes
  console.log('Loading analytics routes...');
  const analyticsRoutes = require('./routes/analytics');
  app.use('/api', analyticsRoutes);
  console.log('✅ Analytics routes loaded');

  // Lead capture routes  
  console.log('Loading lead routes...');
  const leadRoutes = require('./routes/leads');
  app.use('/api', leadRoutes);
  console.log('✅ Lead routes loaded');

  // Authentication routes
  console.log('Loading auth routes...');
  const authRoutes = require('./routes/auth');
  app.use('/api', authRoutes);
  console.log('✅ Auth routes loaded');

  // Dashboard routes
  console.log('Loading dashboard routes...');
  const dashboardRoutes = require('./routes/dashboard');
  app.use('/api', dashboardRoutes);
  console.log('✅ Dashboard routes loaded');

} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}

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

// Export config for use in other modules
module.exports = { app, config };
