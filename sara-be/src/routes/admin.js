const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, admin } = require('../middleware/auth');

router.use(auth, admin);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.get('/bookings', adminController.getBookings);

module.exports = router;