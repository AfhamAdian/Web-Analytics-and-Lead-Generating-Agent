/**
 * Dashboard Routes
 * Routes for handling dashboard and analytics endpoints
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticateToken = require('../middlewares/auth');

// Dashboard data endpoint (protected)
router.get('/dashboard', authenticateToken, dashboardController.handleDashboard);

// Add new site endpoint (protected)
router.post('/addSite', authenticateToken, dashboardController.handleAddSite);

// Site analytics endpoint (protected)
router.get('/sites/:siteId', authenticateToken, dashboardController.handleSiteAnalytics);

// Site visitors with lead scores endpoint (protected)
router.get('/sites/:siteId/visitors', authenticateToken, dashboardController.handleSiteVisitors);

module.exports = router;
