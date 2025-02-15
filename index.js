// const http = require('http')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

app.use(cors())
app.use(express.static('dist'))

// *** *** *** *** *** *** *** *** *** *** *** *** *** ***
const password = process.argv[2]

const url =
  `mongodb+srv://Daniel:${password}@cluster0.dhqoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('note', noteSchema)

// *** *** *** *** *** *** *** *** *** *** *** *** *** ***
// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only JavaScript",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true
//   }
// ]

// *** *** *** *** *** *** *** *** *** *** *** *** *** ***
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// *** *** *** *** *** *** *** *** *** *** *** *** *** ***
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// *** *** *** *** *** *** *** *** *** *** *** *** *** ***
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes))
// })


app.get('/', (request, response) => {
  response.send('<h1>Hello World!!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(note => {
    response.json(note)
  })
})

// *** *** *** *** *** *** *** *** *** *** *** *** *** ***
//Search a note for id 
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(n => n.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// *** *** *** *** *** *** *** *** *** *** *** *** *** ***
//Delete a note for id 
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

// *** *** *** *** *** *** *** *** *** *** *** *** *** ***
//Create new note 
app.use(express.json())
app.use(requestLogger)

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

// *** *** *** *** *** *** *** *** *** *** *** *** *** ***
app.use(unknownEndpoint)

// *** *** *** *** *** *** *** *** *** *** *** *** *** ***
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})