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

module.exports = mongoose.model('Hotel', HotelSchema);
