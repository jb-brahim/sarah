const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  name: String,
  description: String,
  address: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' },
  },
  amenities: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Hotel', HotelSchema);
