import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  // 1. Notice how clean this is now! No onError block.
  const [ createBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS } ]
  })

  if (!props.show) return null

  const submit = async (event) => {
    event.preventDefault()

    try {
      // 2. We try to create the book
      await createBook({  variables: { title, author, published: parseInt(published), genres } })
      
      // 3. If successful, clear the form
      setTitle('')
      setPublished('')
      setAuthor('')
      setGenres([])
      setGenre('')

    } catch (error) {
      // 4. If Mongoose blocks it, we catch it right here!
      console.log('Caught the error directly:', error.message)
      
      setErrorMessage(error.message)
      
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      {/* Display the error message in red if it exists */}
      {errorMessage && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={submit}>
        <div>title <input value={title} onChange={({ target }) => setTitle(target.value)} /></div>
        <div>author <input value={author} onChange={({ target }) => setAuthor(target.value)} /></div>
        <div>published <input type="number" value={published} onChange={({ target }) => setPublished(target.value)} /></div>
        <div>
          <input value={genre} onChange={({ target }) => setGenre(target.value)} />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook