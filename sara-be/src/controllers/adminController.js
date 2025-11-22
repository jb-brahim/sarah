const User = require('../models/User');
const Site = require('../models/Site');
const Hotel = require('../models/Hotel');
const Reservation = require('../models/Reservation');
const Tour = require('../models/Tour');

const getStats = async (req, res, next) => {
  try {
    const [
      userCount,
      siteCount,
      hotelCount,
      activeBookings,
      tourCount
    ] = await Promise.all([
      User.countDocuments(),
      Site.countDocuments(),
      Hotel.countDocuments(),
      Reservation.countDocuments({ status: 'confirmed' }),
      Tour.countDocuments()
    ]);

    const recentBookings = await Reservation.find()
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'name email')
      .populate('hotel', 'name')
      .populate('tour', 'title');

    res.json({
      stats: {
        users: userCount,
        sites: siteCount,
        hotels: hotelCount,
        activeBookings,
        tours: tourCount
      },
      recentBookings
    });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort('-createdAt');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const bookings = await Reservation.find()
      .populate('user', 'name email')
      .populate('hotel', 'name')
      .populate('room', 'number')
      .populate('tour', 'title')
      .sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats,
  getUsers,
  getBookings,
};