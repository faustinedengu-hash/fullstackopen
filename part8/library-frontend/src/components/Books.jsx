import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  // 1. Add state to track the currently selected filter
  const [filter, setFilter] = useState('all')
  const result = useQuery(ALL_BOOKS)

  if (!props.show) return null

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  // 2. Extract all unique genres from the books
  // flatMap combines all genre arrays into one big array, 
  // and Set removes the duplicates!
  const genres = [...new Set(books.flatMap(b => b.genres))]

  // 3. Decide which books to show based on the filter state
  const booksToShow = filter === 'all' 
    ? books 
    : books.filter(b => b.genres.includes(filter))

  return (
    <div>
      <h2>books</h2>
      
      {/* Optional: Show the user what they are filtering by */}
      {filter !== 'all' && (
        <p>in genre <strong>{filter}</strong></p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {/* We now map over 'booksToShow' instead of 'books' */}
          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 4. Render the buttons for filtering */}
      <div>
        {genres.map(g => (
          <button key={g} onClick={() => setFilter(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setFilter('all')}>all genres</button>
      </div>
    </div>
  )
}

export default Books