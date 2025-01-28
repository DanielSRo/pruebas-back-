const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
// app.use(morgan('tiny'))

morgan.token('body', (req) => {
  return req.body
    ? JSON.stringify(req.body)
    : 'No body';
});

app.use(morgan(':method :url :status :res[content-length] bytes - :response-time ms :body'));


// *** *** *** *** *** *** *** *** *** *** *** ***
let phoneBook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]
// *** *** *** *** *** *** *** *** *** *** *** ***
const newId = () => {
  const newId = phoneBook.length > 0
    ? Math.max(...phoneBook.map(person => person.id)) + 1
    : 1

  return newId
}

// *** *** *** *** *** *** *** *** *** *** *** ***

app.get('/info', (request, response) => {
  const entries = phoneBook.length
  const date = new Date()

  response.send(
    `
    <h1>Informatio about the PhoneBook</h1>
    <p>The phonebook has info for ${entries} ${entries > 1 ? 'persons' : 'person'}</p>
    <p>Date of request: ${date}</p>
    `
  )
})

app.get('/api/persons', (request, response) => {
  response.json(phoneBook)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = phoneBook.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  phoneBook = phoneBook.filter(n => n.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {

  const body = request.body

  if (!body.number) {
    return response.status(400).json({
      error: 'Missing Number'
    })
  } else if (!body.name) {
    return response.status(400).json({
      error: 'Missing Name'
    })
  } else if (phoneBook.find(n => n.name.toLowerCase() === body.name.toLowerCase())) {
    return response.status(400).json({
      error: `the name ${body.name} aldeary exists`
    })
  }

  const person = {
    id: newId(),
    name: body.name,
    number: body.number,
  }

  phoneBook = phoneBook.concat(person)

  response.json(person)
})


// *** *** *** *** *** *** *** *** *** *** *** ***
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})