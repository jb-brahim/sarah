const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  number: String,
  type: String,
  price: Number,
  amenities: [String],
  available: { type: Boolean, default: true },
});

module.exports = mongoose.model('Room', RoomSchema);
