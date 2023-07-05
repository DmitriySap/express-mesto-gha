const { celebrate, Joi } = require('celebrate');
const { REGEX_URL } = require('../utils/constants');

module.exports.createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(REGEX_URL),
  }),
});

module.exports.cardIdValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});
