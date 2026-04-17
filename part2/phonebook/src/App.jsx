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

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}> {/* This makes the class either "success" or "error" */}
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
  const [messageType, setMessageType] = useState('success') // can be 'success' or 'error'

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
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
            setMessageType('success')
            setInfoMessage(`Updated ${returnedPerson.name}'s number`)
            setTimeout(() => setInfoMessage(null), 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setMessageType('error')

            setInfoMessage(`Information of ${newName} has already been removed from server`)
            setPersons(persons.filter(p => p.id !== existingPerson.id))
            setTimeout(() => setInfoMessage(null), 5000)
          })
      }
    } else {
      const nameObject = { 
        name: newName, 
        number: newNumber 
      }

      personService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessageType('success')
          setInfoMessage(`Added ${returnedPerson.name}`)
          setTimeout(() => setInfoMessage(null), 5000)
        })
       .catch(error => {
          // 1. Let's print the exact error to the console so we can investigate!
          console.log("Error from backend:", error.response?.data)
          
          setMessageType('error')
          
          // 2. We use a fallback message just in case the backend error string is missing
          setInfoMessage(error.response?.data?.error || 'An error occurred while adding the person') 
          
          setTimeout(() => setInfoMessage(null), 5000)
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
      <Notification message={infoMessage} type={messageType} />
      
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

