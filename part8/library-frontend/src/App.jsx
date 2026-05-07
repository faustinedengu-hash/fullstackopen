import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

// 1. We add the exact query you just tested
const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
    }
  }
`

const App = () => {
  // 2. We run both queries, giving them distinct variable names
  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)

  // 3. Wait for both to finish loading
  if (authorsResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  // 4. Catch errors for either query
  if (authorsResult.error) {
    return <div>Error loading authors: {authorsResult.error.message}</div>
  }
  if (booksResult.error) {
    return <div>Error loading books: {booksResult.error.message}</div>
  }

  // 5. Extract the data
  const authors = authorsResult.data.allAuthors
  const books = booksResult.data.allBooks

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th style={{ textAlign: 'left' }}>Name</th>
            <th style={{ textAlign: 'left' }}>Born</th>
            <th style={{ textAlign: 'left' }}>Books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 6. Add the new Books table right below it */}
      <h2>Books</h2>
      <table>
        <tbody>
          <tr>
            <th style={{ textAlign: 'left' }}>Title</th>
            <th style={{ textAlign: 'left' }}>Author</th>
            <th style={{ textAlign: 'left' }}>Published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App