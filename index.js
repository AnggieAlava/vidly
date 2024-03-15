const Joi = require('joi')
const express = require('express')
const app = express()

app.use(express.json())

const genres = [
  { id: 1, type: "Romance" },
  { id: 2, type: "Comedy" },
  { id: 3, type: "Horror" },
  { id: 4, type: "Thriller" },
  { id: 5, type: "Drama" }
]

app.get('/', (req, res) => {
  res.send("Hello Api Movies...")
})

app.get('/api/genres', (req, res) => {
  res.send(genres)
})

app.get('/api/genres/:id', (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id))
  if (!genre)
    return res
      .status(404) //Not Found
      .send('The genre you are looking for its not available yet... 👎')
  res.send(genre)
})

app.post('/api/genres', (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message)
  const genre = {
    id: genres.length + 1,
    type: req.body.type,
  }
  genres.push(genre)
  res.send(genre)
})

app.put('/api/genres/:id', (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id))
  if (!genre)
    return res
      .status(404)
      .send('The request with the given ID was not found... 🤐')

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  genre.type = req.body.type
  res.send(genre)
})

app.delete('/api/genres/:id', (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id))
  if (!genre)
    return res
      .status(404)
      .send('The request with the given ID was not found... ✋')
  const index = genres.indexOf(genre)
  genres.splice(index, 1)
  res.send(genre)
})


function validateGenre(genre) {
  const schema = Joi.object({
    type: Joi.string().min(3).max(20).required(),
  })
  return schema.validate(genre)
}

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});