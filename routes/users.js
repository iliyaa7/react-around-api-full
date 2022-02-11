const router = require('express').Router();
const {
  getUsers, getUser, createUser, updateUserProfile, updateUserAvatar, login,
} = require('../controllers/users');

router.post('/signup', createUser);

router.post('/signin', login);

router.get('/users', getUsers);

router.get('/users/:id', getUser);

router.patch('/users/me/:id', updateUserProfile);

router.patch('/users/me/avatar/:id', updateUserAvatar);

module.exports = router;
