import { useState } from 'react'
const Filter = ({ searchQuery, handleSearchChange }) => {
  return (
    <div>
      filter shown with <input value={searchQuery} onChange={handleSearchChange} />
    </div>
  )
}
const PersonForm = ({ addName, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}
const Persons = ({ personsToShow }) => {
  return (
    <div>
      {personsToShow.map(person => 
        <p key={person.name}>{person.name} {person.number}</p>
      )}
    </div>
  )
}
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()

    const isDuplicate = persons.some(person => person.name === newName)

    if (isDuplicate) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const nameObject = { 
        name: newName, 
        number: newNumber 
      }
      
      setPersons(persons.concat(nameObject))
      setNewName('')
      setNewNumber('')
    }
  }

  const personsToShow = searchQuery === ''
    ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchQuery={searchQuery} handleSearchChange={handleSearchChange} />

      <h3>Add a new</h3>
      <PersonForm 
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} />
    </div>
  )
export default App