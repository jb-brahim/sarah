const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  title: String,
  description: { type: Map, of: String },
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site' },
  availableDates: [Date],
  guides: [String],
  duration: { type: Number, default: 3 }, // in days
  price: Number,
  images: [String],
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

// Virtual field for reviews
TourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'itemId',
  match: { itemType: 'tour' }
});

// Method to calculate average rating from reviews
TourSchema.methods.calculateAverageRating = async function () {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ itemId: this._id, itemType: 'tour' });

  if (reviews.length === 0) return this.rating;

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal
};

module.exports = mongoose.model('Tour', TourSchema);
