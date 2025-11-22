const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

const getAll = async (req, res, next) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    next(err);
  }
};

const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ hotel: req.params.id });
    res.json(rooms);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json(hotel);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    await Room.deleteMany({ hotel: req.params.id });
    res.json({ message: 'Hotel and associated rooms deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getOne,
  getRooms,
  create,
  update,
  delete: deleteOne
};