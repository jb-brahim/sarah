const Site = require('../models/Site');
const User = require('../models/User');

const getRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('visitedSites');
    
    // Get user preferences and visited sites
    const preferences = user.preferences;
    const visitedSiteIds = user.visitedSites.map(site => site._id);
    
    // Find sites matching user preferences that haven't been visited
    const recommendedSites = await Site.find({
      _id: { $nin: visitedSiteIds },
      category: { $in: preferences }
    }).limit(10);
    
    res.json(recommendedSites);
  } catch (err) {
    next(err);
  }
};

const getNearby = async (req, res, next) => {
  try {
    const { lat, lng } = req.params;
    const radius = 10000; // 10km in meters

    const nearbySites = await Site.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius
        }
      }
    }).limit(10);

    res.json(nearbySites);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRecommendations,
  getNearby,
};