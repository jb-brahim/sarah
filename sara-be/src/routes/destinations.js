const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

// Public routes (no auth required for viewing destinations, similar to how it was before)
// If you want to protect it, add 'auth' middleware
router.get('/', destinationController.getAllDestinations);
router.post('/seed', destinationController.seedDestinations); // Open for now to easy seed

module.exports = router;
