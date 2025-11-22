const Joi = require('joi');

const siteCreate = Joi.object({
  name: Joi.string().required(),
  description: Joi.object().required(),
  images: Joi.array().items(Joi.string().uri()).default([]),
  location: Joi.object({
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
    address: Joi.string().allow('', null),
  }).required(),
  category: Joi.string().allow('', null),
  entryFee: Joi.number().min(0).default(0),
});

module.exports = { siteCreate };
