import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [filter, setFilter] = useState('all')
  const [genres, setGenres] = useState([]) // New state to hold our buttons safely

  // Pass the filter to the query. If 'all', pass null so the backend returns everything.
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: filter === 'all' ? null : filter }
  })

  // Capture all unique genres on the initial load so our buttons don't disappear!
  useEffect(() => {
    if (result.data && filter === 'all') {
      const allGenres = [...new Set(result.data.allBooks.flatMap(b => b.genres))]
      setGenres(allGenres)
    }
  }, [result.data, filter])

  if (!props.show) return null

  if (result.loading) {
    return <div>loading...</div>
  }

  // We no longer need 'booksToShow' because the backend did the filtering for us!
  const books = result.data.allBooks

  return (
    <div>
      <h2>books</h2>
      
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
          {/* We map directly over 'books' now */}
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {/* We map over our safely stored 'genres' state */}
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