const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translateController');

// Allow anonymous translation requests to support public UI usage and avoid
// blocking basic functionality. Upstream quotas and abuse should be handled
// via rate limiting or API key configuration in production.
router.post('/', translateController.translate);

module.exports = router;