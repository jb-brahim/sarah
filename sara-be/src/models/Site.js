const mongoose = require('mongoose');

const SiteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: Map, of: String },
  images: [String],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' }, // [lng, lat]
    address: String,
  },
  category: String,
  entryFee: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Site', SiteSchema);
