const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const Tour = require('../models/Tour');

const getAll = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('hotel')
      .populate('room')
      .populate('tour');
    res.json(reservations);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate('hotel')
      .populate('room')
      .populate('tour');
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    res.json(reservation);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    // Room availability (existing logic)
    if (req.body.room) {
      const room = await Room.findById(req.body.room);
      if (!room || !room.available) {
        return res.status(400).json({ message: 'Room not available' });
      }
      await Room.findByIdAndUpdate(req.body.room, { available: false });
    }

    // Tour availability: check if same tour/date already reserved
    if (req.body.tour && req.body.from) {
      const existing = await Reservation.findOne({ tour: req.body.tour, from: new Date(req.body.from), status: 'confirmed' });
      if (existing) {
        return res.status(400).json({ message: 'Selected tour/date is not available' });
      }
    }

    const reservation = await Reservation.create({
      ...req.body,
      user: req.user._id,
      status: 'confirmed'
    });

    res.status(201).json(reservation);
  } catch (err) {
    next(err);
  }
};

const cancel = async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    
    if (reservation.room) {
      await Room.findByIdAndUpdate(reservation.room, { available: true });
    }
    
    reservation.status = 'cancelled';
    await reservation.save();
    
    res.json(reservation);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  cancel,
};