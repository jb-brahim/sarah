const Review = require('../models/Review');

const create = async (req, res, next) => {
  try {
    const { itemId, itemType, rating, comment } = req.body;
    if (!itemId || !itemType || !rating) return res.status(400).json({ message: 'Missing fields' });

    const review = await Review.create({ user: req.user._id, itemId, itemType, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

const getByItem = async (req, res, next) => {
  try {
    const { itemId } = req.query;
    if (!itemId) return res.status(400).json({ message: 'itemId required' });
    const reviews = await Review.find({ itemId }).populate('user', 'name email');
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getByItem };
