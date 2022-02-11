const router = require('express').Router();
const {
  getUsers, getUser, createUser, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:id', getUser);

router.post('/users', createUser);

router.patch('/users/me/:id', updateUserProfile);

router.patch('/users/me/avatar/:id', updateUserAvatar);

module.exports = router;
