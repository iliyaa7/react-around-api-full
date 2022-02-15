const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const cardsRoute = require('./routes/cards');
const usersRoute = require('./routes/users');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const validateUserData = require('./middlewares/validateUserData');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralizedErrHandler = require('./middlewares/centralizedHandler');
require('dotenv').config();

const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');

const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});
app.post('/signup', validateUserData, createUser);
app.post('/signin', validateUserData, login);
app.use(auth);
app.use('/', cardsRoute);
app.use('/', usersRoute);

app.use(errorLogger);
app.use(errors());
app.use(centralizedErrHandler);

app.listen(PORT);
