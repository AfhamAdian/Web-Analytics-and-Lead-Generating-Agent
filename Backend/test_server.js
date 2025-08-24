/**
 * Test Server - Minimal version to debug the issue
 */

const express = require('express');

// Create Express application
const app = express();

app.use(express.json());

// Simple test route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Test server is running'
  });
});

// Start server
const server = app.listen(5000, () => {
  console.log(`🚀 Test server running at http://localhost:5000`);
});

module.exports = app;
