const Joi = require('joi');

const tourCreate = Joi.object({
  title: Joi.string().required(),
  description: Joi.object().required(),
  site: Joi.string().required(),
  availableDates: Joi.array().items(Joi.date()).default([]),
  guides: Joi.array().items(Joi.string()).default([]),
  price: Joi.number().min(0).required(),
});

module.exports = { tourCreate };
