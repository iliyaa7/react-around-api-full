const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const validateUrl = require('../custom-validator/validateUrl');

// Should i validate the userId that i extract from the payload before sending it to the controller?
// just in a case that the payload wasn't originaly created from a users id or some other error
// that the auth middleware didnt catch?

// Should i remove the error handlers for validation from the controllers?
// Or there are cases that the celbrate validator could fale?

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateUrl),
  }),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

module.exports = router;
