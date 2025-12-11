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
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Tour', TourSchema);
