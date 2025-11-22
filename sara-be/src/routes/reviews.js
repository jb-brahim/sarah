const express = require('express');
const router = express.Router();
const { create, getByItem } = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');

router.get('/', getByItem);
router.post('/', auth, create);

module.exports = router;
