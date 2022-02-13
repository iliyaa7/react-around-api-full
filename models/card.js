const mongoose = require('mongoose');
const NotFoundError = require('../errors/not-found-err');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(v);
      },
      message: 'Error, not a valid url',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

cardSchema.statics.isOwensCard = function isOwensCard(owner, _id) {
  return this.findById({ _id })
    .orFail(() => {
      throw new NotFoundError('No card found with that id');
    })
    .then((card) => {
      // Is there a build in mongoose method or a more elegant way of doing that?
      if (JSON.stringify(card.owner).slice(1, -1) !== owner) {
        const CustomError = new Error('You are not the owner of this card');
        CustomError.statusCode = 403;
        throw CustomError;
      }
      return card;
    });
};

module.exports = mongoose.model('card', cardSchema);
