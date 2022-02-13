const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const InvalidDataError = require('../errors/invalid-data-err');

const NotFoundCardError = new NotFoundError('No card found with that id');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(err.statusCode).send({ message: err.message }));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InvalidDataError('invalid data passed to the server');
      } throw err;
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.isOwensCard(req.user._id, req.params.cardId)
    .then((card) => {
      Card.findByIdAndRemove(card._id)
        .orFail(() => {
          throw NotFoundCardError;
        })
        .then((deletedCard) => res.send({ deletedCard }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new InvalidDataError('invalid card id');
      } throw err;
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .orFail(() => {
      throw NotFoundCardError;
    })
    .then((updatedCard) => res.send(updatedCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new InvalidDataError('invalid card id');
      } throw err;
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .orFail(() => {
      throw NotFoundCardError;
    })
    .then((updatedCard) => res.send(updatedCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new InvalidDataError('invalid card id');
      } throw err;
    })
    .catch(next);
};
