const Joi = require('joi');

const reservationCreate = Joi.object({
  hotel: Joi.string().optional(),
  room: Joi.string().optional(),
  tour: Joi.string().optional(),
  from: Joi.date().required(),
  to: Joi.date().required(),
  price: Joi.number().min(0).required(),
});

module.exports = { reservationCreate };
