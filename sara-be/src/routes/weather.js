const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/:siteId', weatherController.getSiteWeather);
router.get('/coordinates/:lat/:lng', weatherController.getWeatherByCoordinates);

module.exports = router;