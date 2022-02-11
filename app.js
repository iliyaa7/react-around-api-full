const express = require('express');
const mongoose = require('mongoose');
const cardsRoute = require('./routes/cards');
const usersRoute = require('./routes/users');
require('dotenv').config();

const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');

const { PORT = 3000 } = process.env;

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '61da36e4b35ce358a9805940',
  };

  next();
});
app.use('/', cardsRoute);
app.use('/', usersRoute);
app.use((req, res) => res.status(404).send({ message: 'The requested resource was not found' }));

app.listen(PORT);
