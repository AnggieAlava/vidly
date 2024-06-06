const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);


  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0)
    return res.status(400).send('Movie not in stock.');

  // TODO: test this code for ATOMICITY
  const session = await Rental.startSession();
  if (!session)
    return res
      .status(500)
      .send('Internal Server Error: Unable to start a database session.');

  session.startTransaction();

  try {
    const rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    await rental.save({ session });

    movie.numberInStock--;
    await movie.save({ session });

    await session.commitTransaction();

    res.status(201).send(rental);
  } catch (ex) {
    await session.abortTransaction();
    res.status(500).send(ex.message);
  } finally {
    session.endSession();
  }
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental)
    return res.status(404).send('The rental with the given ID was not found.');
  res.send(rental);
});

module.exports = router;
