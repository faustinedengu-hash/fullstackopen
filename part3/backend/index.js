const express = require('express')
const app = express()

// 1. Data comes first
let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

// 2. Then your routes
app.get('/', (request, response) => {
  response.send('<h1>Hello Phonebook!</h1>')
})

app.get('/info', (request, response) => {
  const count = persons.length
  const date = new Date()
  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${date}</p>
  `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// 3. The server setup stays at the bottom
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})