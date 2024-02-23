import express, { Request, Response } from 'express';
import cors from 'cors';
import * as AWS from 'aws-sdk';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { Contact } from './src/DynamoDBContactMapping';
import config from './src//config';

const app = express()

// Initialize DynamoDB client and DataMapper
const client = new AWS.DynamoDB({ region: config.serviceRegion });
const mapper = new DataMapper({ client });

app.use(cors());
app.use(express.json());

interface ContactRequestBody {
    name: string;
    number: string;
}

app.get('/info', async (_request: Request, response: Response): Promise<void> => {
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

app.get('/api/phonebook', async (_request: Request, response: Response): Promise<void>  => {
  const contacts = [];
    for await (const contact of mapper.scan(Contact)) {
        contacts.push(contact);
    }
  response.json(contacts)
})

app.get('/api/phonebook/:id', (request: Request, response: Response): void => {
  const id = request.params.id;
  mapper.get(Object.assign(new Contact(), { id }))
      .then(contact => {
          response.json(contact);
      })
      .catch(_error => {
          response.status(404).send({ error: 'Not found' });
      });
});

app.delete('/api/phonebook/:id', (request: Request, response: Response): void => {
  const id = request.params.id;
  mapper.delete(Object.assign(new Contact(), { id }))
      .then(() => {
          response.status(204).end(); // Successfully deleted the item
      })
      .catch((_error) => {
          response.status(404).send({ error: 'Not found' });
      });
})
  
app.post('/api/phonebook', (request: Request, response: Response): void => {
  const { name, number } = request.body as ContactRequestBody;
  if (!name || !number) {
      response.status(400).json({ error: 'name or number missing' });
      return;
  }

  const contact = new Contact();
  contact.name = name;
  contact.number = number;

  mapper.put(contact)
      .then(() => {
          response.json(contact); // Successfully added the contact
      })
      .catch((_error) => {
          response.status(500).send({ error: 'Error adding contact' }); 
      });
});

const unknownEndpoint = (_request: Request, response: Response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})