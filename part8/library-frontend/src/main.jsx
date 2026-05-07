import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// 1. Add HttpLink to the core imports
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'

const client = new ApolloClient({
  // 2. Wrap the uri inside a new HttpLink
  link: new HttpLink({ uri: 'http://localhost:4000' }),
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)