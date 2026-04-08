import { useState } from 'react'

const App = () => {
  // 1. ALL state lives inside the App component
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // 2. ALL handlers live inside the App component
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

  // 3. Filter logic runs right before the return
  const personsToShow = searchQuery === ''
    ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
      )

  // 4. The UI
  return (
    <div>
      <h2>Phonebook</h2>
      
      <div>
        filter shown with <input value={searchQuery} onChange={handleSearchChange} />
      </div>

      <h2>add a new</h2>
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
      
      <h2>Numbers</h2>
      {personsToShow.map(person => 
        <p key={person.name}>{person.name} {person.number}</p>
      )}
    </div>
  )
}

export default App