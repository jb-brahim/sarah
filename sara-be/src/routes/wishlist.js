const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getForUser, addItem, removeItem } = require('../controllers/wishlistController');

router.get('/', auth, getForUser);
router.post('/', auth, addItem);
router.delete('/:id', auth, removeItem);

module.exports = router;
