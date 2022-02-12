const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const CustomError = new Error('No user found with that id');
CustomError.statusCode = 404;

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({ token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }) });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => res.status(err.statusCode).send({ message: err.message }));
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw CustomError;
    })
    .then((user) => res.send({ requestedUser: user }))
    .catch((err) => {
      if (err.statusCode === 400) {
        res.status(400).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(400).send({ error: 'invalid user id' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message || 'internal server error' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.send({ message: 'user created succefuly', createdUser: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ error: 'invalid data passed to the server' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else if (err.code === 11000) {
        res.status(422).send({ message: 'User with that email already exists' });
      } else {
        res.status(500).send({ message: err.message || 'internal server error' });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, runValidators: true,
    },
  )
    .orFail(() => {
      throw CustomError;
    })
    .then((updatedUser) => res.send({ message: 'user`s profile updated succefuly', updatedUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ error: 'invalid data passed to the server' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ error: 'invalid user id' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message || 'internal server error' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw CustomError;
    })
    .then((updatedUser) => res.send({ message: 'user`s avatar updated succefuly', updatedUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ error: 'invalid data passed to the server' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ error: 'invalid user id' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message || 'internal server error' });
      }
    });
};
