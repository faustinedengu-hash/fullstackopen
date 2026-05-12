import { useState, useEffect } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { BOOK_ADDED, ALL_BOOKS } from './queries' // <-- Added ALL_BOOKS import

// --- CACHE HELPER FOR EXERCISE 8.25 ---
// This prevents the same book from being saved to the cache twice
export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  // --- UPDATED SUBSCRIPTION HOOK ---
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      console.log('Subscription data received:', data)
      const addedBook = data.data.bookAdded
      window.alert(`A new book just dropped: ${addedBook.title} by ${addedBook.author.name}`)
      
      // Update the local cache so the UI updates instantly
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })

  // Check if user is already logged in when the app starts
  useEffect(() => {
    const savedToken = localStorage.getItem('library-user-token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore() // Clear Apollo cache on logout
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors show={page === 'authors'} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
      <Recommend show={page === 'recommend'} />
      <LoginForm 
        show={page === 'login'} 
        setToken={setToken} 
        setPage={setPage} 
      />
    </div>
  )
}

export default App