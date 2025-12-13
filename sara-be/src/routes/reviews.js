const express = require('express');
const router = express.Router();
const { create, getByItem, getByUser, update, deleteReview } = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');

router.get('/', getByItem);
router.get('/user/:userId', getByUser);
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, deleteReview);

module.exports = router;
