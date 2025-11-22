const axios = require('axios');
const Site = require('../models/Site');

const getSiteWeather = async (req, res, next) => {
  try {
    const site = await Site.findById(req.params.siteId);
    if (!site) return res.status(404).json({ message: 'Site not found' });

    const [lng, lat] = site.location.coordinates;
    const weather = await getWeatherData(lat, lng);
    res.json(weather);
  } catch (err) {
    next(err);
  }
};

const getWeatherByCoordinates = async (req, res, next) => {
  try {
    const { lat, lng } = req.params;
    const weather = await getWeatherData(lat, lng);
    res.json(weather);
  } catch (err) {
    next(err);
  }
};

const getWeatherData = async (lat, lng) => {
  const apiKey = process.env.OPENWEATHER_KEY;
  if (!apiKey) throw new Error('OpenWeather API key not configured');

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
  const { data } = await axios.get(url);
  
  return {
    temperature: data.main.temp,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    icon: data.weather[0].icon,
  };
};

module.exports = {
  getSiteWeather,
  getWeatherByCoordinates,
};