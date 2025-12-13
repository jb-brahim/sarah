const Review = require('../models/Review');

const create = async (req, res, next) => {
  try {
    const { itemId, itemType, rating, comment, visitDate } = req.body;
    if (!itemId || !itemType || !rating) return res.status(400).json({ message: 'Missing required fields' });

    const review = await Review.create({
      user: req.user._id,
      itemId,
      itemType,
      rating,
      comment,
      visitDate
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name email');
    res.status(201).json(populatedReview);
  } catch (err) {
    next(err);
  }
};

const getByItem = async (req, res, next) => {
  try {
    const { itemId, itemType } = req.query;
    if (!itemId) return res.status(400).json({ message: 'itemId required' });

    const query = { itemId };
    if (itemType) query.itemType = itemType;

    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

const getByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ user: userId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment, visitDate } = req.body;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (visitDate) review.visitDate = visitDate;

    await review.save();
    const updatedReview = await Review.findById(id).populate('user', 'name email');
    res.json(updatedReview);
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(id);
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getByItem, getByUser, update, deleteReview };
