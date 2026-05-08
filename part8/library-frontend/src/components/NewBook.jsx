import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(CREATE_BOOK, {
    // We can still let it automatically refetch authors, as that query has no variables
    refetchQueries: [ { query: ALL_AUTHORS } ], 
    
    // The update callback fires as soon as the mutation returns a successful response
    update: (cache, response) => {
      const addedBook = response.data.addBook

      // Helper function to safely update the cache for a specific set of variables
      const updateCacheForQuery = (variables) => {
        cache.updateQuery({ query: ALL_BOOKS, variables }, (data) => {
          // If this specific query hasn't been fetched yet, skip it
          if (!data) return null 
          
          // Prevent duplicates just in case
          if (data.allBooks.some(b => b.title === addedBook.title)) {
            return data
          }

          // Return the old books PLUS the newly added book
          return {
            allBooks: data.allBooks.concat(addedBook)
          }
        })
      }

      // 1. Update the main "all genres" cache (where genre is null)
      updateCacheForQuery({ genre: null })

      // 2. Update the cache for every specific genre the newly added book belongs to
      addedBook.genres.forEach(g => {
        updateCacheForQuery({ genre: g })
      })
    },
    onError: (error) => {
      console.error('Error creating book:', error)
    }
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    createBook({ 
      variables: { title, author, published: parseInt(published), genres } 
    })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>add a new book</h2>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook