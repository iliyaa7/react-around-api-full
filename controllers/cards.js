const Card = require('../models/card');

const CustomError = new Error('No card found with that id');
CustomError.statusCode = 404;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(err.statusCode).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ error: 'invalid data passed to the server' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message || 'internal server error' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.isOwensCard(req.user._id, req.params.cardId)
    .then((card) => {
      Card.findByIdAndRemove(card._id)
        .orFail(() => {
          throw CustomError;
        })
        .then((deletedCard) => res.send({ deletedCard }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ error: 'invalid card id' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else if (err.statusCode === 403) {
        res.status(403).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message || 'internal server error' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .orFail(() => {
      throw CustomError;
    })
    .then((updatedCard) => res.send(updatedCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ error: 'invalid card id' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message || 'internal server error' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .orFail(() => {
      throw CustomError;
    })
    .then((updatedCard) => res.send(updatedCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ error: 'invalid card id' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message || 'internal server error' });
      }
    });
};
