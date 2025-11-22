const Joi = require('joi');

const hotelCreate = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('', null),
  address: Joi.string().allow('', null),
  location: Joi.object({
    coordinates: Joi.array().items(Joi.number()).length(2),
  }).optional(),
  amenities: Joi.array().items(Joi.string()).default([]),
});

module.exports = { hotelCreate };
