const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  itemType: { type: String, enum: ['site', 'hotel', 'tour'], required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 1000 },
  visitDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// Indexes for efficient queries
ReviewSchema.index({ itemId: 1, itemType: 1, createdAt: -1 });
ReviewSchema.index({ user: 1 });

module.exports = mongoose.model('Review', ReviewSchema);
