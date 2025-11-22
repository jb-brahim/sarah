const Tour = require('../models/Tour');

const getAll = async (req, res, next) => {
  try {
    const tours = await Tour.find().populate('site');
    res.json(tours);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id).populate('site');
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.json(tour);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json(tour);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.json(tour);
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.json({ message: 'Tour deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  delete: deleteOne
};