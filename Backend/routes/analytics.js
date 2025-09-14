/**
 * Analytics Routes
 * Routes for handling analytics tracking endpoints
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics');

// Session creation endpoint for rrweb integration
router.post('/session', analyticsController.handleSessionCreation);

// Session recording endpoint for rrweb data
router.post('/session-recording', analyticsController.handleSessionRecording);

// User system information endpoint
router.post('/user-system-info', analyticsController.handleUserSystemInfo);

// Page views tracking endpoint
router.post('/pageviews', analyticsController.handlePageViews);

// Scroll depth tracking endpoint
router.post('/scroll-depth', analyticsController.handleScrollDepth);

// Session time tracking endpoint
router.post('/sessiontime', analyticsController.handleSessionTime);

// Click events tracking endpoint
router.post('/click-events', analyticsController.handleClickEvents);

module.exports = router;
