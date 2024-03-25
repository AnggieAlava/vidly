const mongoose = require('mongoose')
const customers = require('./routes/customers')
const genres = require('./routes/genres')
const express = require('express')
const app = express()

mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB succesfully...'))
  .catch(() => console.error('Could not connect to MongoDB...'))

app.use(express.json())
app.use('/api/genres', genres)
app.use('/api/customers', customers)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});