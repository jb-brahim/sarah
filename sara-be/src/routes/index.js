const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/sites', require('./sites'));
router.use('/hotels', require('./hotels'));
router.use('/reservations', require('./reservations'));
router.use('/tours', require('./tours'));
router.use('/weather', require('./weather'));
router.use('/translate', require('./translate'));
router.use('/recommendations', require('./recommendations'));
router.use('/admin', require('./admin'));
router.use('/reviews', require('./reviews'));
router.use('/wishlist', require('./wishlist'));
router.use('/payments', require('./payments'));
router.use('/destinations', require('./destinations'));

module.exports = router;
