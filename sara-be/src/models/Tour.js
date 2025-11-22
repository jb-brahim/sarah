const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  title: String,
  description: { type: Map, of: String },
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site' },
  availableDates: [Date],
  guides: [String],
  price: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Tour', TourSchema);
