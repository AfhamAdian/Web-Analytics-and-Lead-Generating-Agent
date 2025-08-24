/**
 * Lead Routes
 * Routes for handling lead capture and form submission endpoints
 */

const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leads');

// User detail information capture (Fabricx specific)
router.post('/user-detail-informations', leadController.handleUserDetailInformation);

// General form submission endpoint
router.post('/form-submit', leadController.handleFormSubmit);

// Visitor identification endpoint
router.post('/identify-visitor', leadController.handleIdentifyVisitor);

module.exports = router;
