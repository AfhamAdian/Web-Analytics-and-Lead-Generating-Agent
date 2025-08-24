/**
 * Authentication Routes
 * Routes for handling user authentication
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const authenticateToken = require('../middlewares/auth');

// User registration endpoint
router.post('/signup', authController.handleSignup);

// User login endpoint
router.post('/login', authController.handleLogin);

// Update user profile (protected)
router.put('/profile', authenticateToken, authController.handleUpdateProfile);

// Change password (protected)
router.put('/change-password', authenticateToken, authController.handleChangePassword);

module.exports = router;
