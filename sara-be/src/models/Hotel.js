const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  name: String,
  description: String,
  address: String,
  price: { type: Number, default: 150 },
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  images: [String],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' },
  },
  amenities: [String],
  createdAt: { type: Date, default: Date.now },
});

// Virtual field for reviews
HotelSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'itemId',
  match: { itemType: 'hotel' }
});

// Method to calculate average rating from reviews
HotelSchema.methods.calculateAverageRating = async function () {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ itemId: this._id, itemType: 'hotel' });

  if (reviews.length === 0) return this.rating;

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal
};

module.exports = mongoose.model('Hotel', HotelSchema);
