const { celebrate, Joi } = require('celebrate');

module.exports = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }).unknown(true),
});
