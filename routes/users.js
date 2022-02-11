const router = require('express').Router();
const {
  getUsers, getUser, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:id', getUser);

router.patch('/users/me/:id', updateUserProfile);

router.patch('/users/me/avatar/:id', updateUserAvatar);

module.exports = router;
