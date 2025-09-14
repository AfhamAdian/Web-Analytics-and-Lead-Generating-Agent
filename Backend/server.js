/**
 * Main Server File
 * Entry point for the Web Analytics and Lead Generation API
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');

// Create Express application
const app = express();

// Middleware setup
app.use(morgan('dev')); // Logging middleware
app.use(cors(config.corsOptions)); // CORS middleware
app.use(express.json({ limit: '50mb' })); // JSON parsing middleware with increased limit for session recordings
app.use(express.urlencoded({ limit: '50mb', extended: true })); // URL-encoded parsing with increased limit

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
  
  // Handle payload too large errors specifically
  if (error.type === 'entity.too.large') {
    console.error('❌ Payload too large error:', error.message);
    return res.status(413).json({
      message: 'Session recording data is too large',
      error: 'The session recording contains too much data. Consider reducing recording duration or frequency.',
      maxSize: '50MB'
    });
  }
  
  res.status(error.status || 500).json({
    message: error.message || 'Internal server error',
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
