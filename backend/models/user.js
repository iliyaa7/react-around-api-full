const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthError = require('../errors/auth-err');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const AuthenError = new AuthError('Incorrect email or password');
const urlRegex = /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'email pattern is wrong',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    select: false,
  },
  name: {
    type: String,
    default: 'Iliya',
    minlength: 2,
    maxlength: 40,
  },
  about: {
    type: String,
    default: 'Guitar teacher',
    minlength: 2,
    maxlength: 50,
  },
  avatar: {
    type: String,
    default: 'https://code.s3.yandex.net/web-code/bald-mountains.jpg',
    validate: {
      validator(v) {
        return urlRegex.test(v);
      },
      message: 'Error, not a valid url',
    },
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw AuthenError;
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw AuthenError;
          }

          return user;
        });
    });
};

module.exports = mongoose.models.user || mongoose.model('user', userSchema);
