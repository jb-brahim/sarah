const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
  from: Date,
  to: Date,
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  price: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reservation', ReservationSchema);
