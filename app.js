const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cardsRoute = require('./routes/cards');
const usersRoute = require('./routes/users');
const auth = require('./middleware/auth');
const { createUser, login } = require('./controllers/users');
require('dotenv').config();
// Dear reviwer, could you please help me with something in the card schema?
const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');

const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(cors());
app.post('/signup', createUser);
app.post('/signin', login);
app.use(auth);
app.use('/', cardsRoute);
app.use('/', usersRoute);
app.use((req, res) => res.status(404).send({ message: 'The requested resource was not found' }));

app.listen(PORT);
