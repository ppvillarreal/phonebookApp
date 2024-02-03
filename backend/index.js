const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
var morgan = require('morgan')

app.use(express.json());

morgan.token('body', function getBody (request) {
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :response-time :body'))

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const ID_LENGTH = 1000000000;

const generateId = () => {
    return Math.floor(Math.random() * ID_LENGTH) + 1;
}

app.get('/info', (request, response) => {
    const message = 
        `<p>Phonebook has info for ${phonebook.length} people</p>` +
        `<p> ${new Date()} </p>`
    response.send(message)
})

app.get('/api/phonebook', (request, response) => {
  response.json(phonebook)
})

app.get('/api/phonebook/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = phonebook.find(contact => contact.id === id)
    
    if (contact) {
      response.json(contact)
    } else {
      response.status(404).end()
    }
  })

app.delete('/api/phonebook/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(contact => contact.id !== id)
  
    response.status(204).end()
})
  
app.post('/api/phonebook', (request, response) => {
    console.log(request.body)
    const body = request.body
    console.log(body)
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    } else if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    } else if (phonebook.find(contact => contact.name === body.name)){
       return response.status(400).json({ 
         error: 'name already exists' 
       })
    }

    const contact = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    phonebook = phonebook.concat(contact)
  
    response.json(contact)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})