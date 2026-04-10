import personService from './services/persons'
import { useState, useEffect } from 'react'

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

const Persons = ({ personsToShow, deletePerson }) => {
  return (
    <div>
      {personsToShow.map(person => 
        <p key={person.id || person.name}>
          {person.name} {person.number} 
          <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
        </p>
      )}
    </div>
  )
}
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="success">
      {message}
    </div>
  )
}
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [infoMessage, setInfoMessage] = useState(null)

  useEffect(() => {
    console.log('effect is running')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])

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
    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            
            // Notification for Update
            setInfoMessage(`Updated ${returnedPerson.name}'s number`)
            setTimeout(() => setInfoMessage(null), 5000)
            
            setNewName('')
            setNewNumber('')
          })
      }
    } else {
      const nameObject = { name: newName, number: newNumber }

      personService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          
          // Notification for New Addition
          setInfoMessage(`Added ${returnedPerson.name}`)
          setTimeout(() => setInfoMessage(null), 5000)

          setNewName('')
          setNewNumber('')
        })
    }
  }
const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const personsToShow = searchQuery === ''
    ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
      )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={infoMessage} />
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
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App