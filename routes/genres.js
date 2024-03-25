const mongoose = require('mongoose')
const Joi = require('joi')
const express = require('express')
const router = express.Router()

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  }
})

const Genre = mongoose.model('Genre', genreSchema)


router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name')
  res.send(genres)
})

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id)

  if (!genre)
    return res
      .status(404) //Not Found
      .send('The genre you are looking for its not available yet... 👎')

  res.send(genre)
})

router.post('/', async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  let genre = new Genre({ name: req.body.name })
  genre = await genre.save();
  res.send(genre)
})

router.put('/:id', async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  })

  if (!genre)
    return res
      .status(404)
      .send('The request with the given ID was not found... 🤐')

  res.send(genre)
})

router.delete('/:id', async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id)

  if (!genre)
    return res
      .status(404)
      .send('The request with the given ID was not found... ✋')

  res.send(genre)
})


function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
  })
  return schema.validate(genre)
}

module.exports = router