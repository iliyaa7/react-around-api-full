const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getCurrentUser, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');
const validateUrl = require('../custom-validator/validateUrl');

router.get('/users', getUsers);

router.get('/users/me', getCurrentUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(40),
    about: Joi.string().required().min(2).max(50),
  }),
}), updateUserProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateUrl),
  }),
}), updateUserAvatar);

module.exports = router;
