const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const customers = require('./routes/customers');
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB succesfully...'))
  .catch(() => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});
