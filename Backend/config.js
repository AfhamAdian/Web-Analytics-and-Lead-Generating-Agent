/**
 * Application Configuration
 * Central configuration for the application
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

module.exports = {
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
  trackingScriptUrl: process.env.TRACKING_SCRIPT_URL || 'http://localhost:8080/track.js',
  // trackingScriptUrl: 'http://localhost:8080/track.js'
};
