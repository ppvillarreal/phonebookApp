const express = require('express')
const cors = require('cors')
const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { DataMapper } = require('@aws/dynamodb-data-mapper');
const Contact = require('./DynamoDBContactMapping');

const app = express()

// Initialize DynamoDB client and DataMapper
const client = new DynamoDB({ region: process.env.SERVICE_REGION });
const mapper = new DataMapper({ client });

app.use(cors())
var morgan = require('morgan')
app.use(express.json());

morgan.token('body', function getBody (request) {
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :response-time :body'))

const ID_LENGTH = 1000000000;

app.get('/info', (request, response) => {
  let count = 0;
  for await (const _ of mapper.scan(Contact, { 
      projection: ['id'] 
  })) {
      count++;
  }
  const message = 
      `<p>Phonebook has info for ${count} people</p>` +
      `<p> ${new Date()} </p>`;
  response.send(message);
})

app.get('/api/phonebook', (request, response) => {
  const contacts = [];
    for await (const contact of mapper.scan(Contact)) {
        contacts.push(contact);
    }
  response.json(phonebook)
})

app.get('/api/phonebook/:id', (request, response) => {
  const id = request.params.id;
  mapper.get(Object.assign(new Contact(), { id }))
      .then(contact => {
          response.json(contact);
      })
      .catch(error => {
          response.status(404).send({ error: 'Not found' });
      });
});

app.delete('/api/phonebook/:id', (request, response) => {
  const id = req.params.id;
  mapper.delete(Object.assign(new Contact(), { id }))
      .then(() => {
          res.status(204).end(); // Successfully deleted the item
      })
      .catch((error) => {
          res.status(404).send({ error: 'Not found' });
      });
})
  
app.post('/api/phonebook', (request, response) => {
  const { name, number } = request.body;
  if (!name || !number) {
      return response.status(400).json({ error: 'name or number missing' });
  }

  const contact = new Contact();
  contact.name = name;
  contact.number = number;

  mapper.put(contact)
      .then(() => {
          response.json(contact); // Successfully added the contact
      })
      .catch((error) => {
          response.status(500).send({ error: 'Error adding contact' }); 
      });
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})