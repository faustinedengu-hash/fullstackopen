const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

let authors = [
  { name: 'Robert Martin', id: "afa51ab0-344d-11e9-a414-719c6709cf3e", born: 1952 },
  { name: 'Martin Fowler', id: "afa51bb0-344d-11e9-a414-719c6709cf3e", born: 1963 },
  { name: 'Fyodor Dostoevsky', id: "afa51cc0-344d-11e9-a414-719c6709cf3e", born: 1821 },
  { name: 'Joshua Kerievsky', id: "afa51de0-344d-11e9-a414-719c6709cf3e" },
  { name: 'Sandi Metz', id: "afa51ff0-344d-11e9-a414-719c6709cf3e" },
]

let books = [
  { title: 'Clean Code', published: 2008, author: 'Robert Martin', id: "afa5b6f0-344d-11e9-a414-719c6709cf3e", genres: ['refactoring'] },
  { title: 'Agile software development', published: 2002, author: 'Robert Martin', id: "afa5b6f1-344d-11e9-a414-719c6709cf3e", genres: ['agile', 'patterns', 'design'] },
  { title: 'Refactoring, edition 2', published: 2018, author: 'Martin Fowler', id: "afa5de00-344d-11e9-a414-719c6709cf3e", genres: ['refactoring'] },
  { title: 'Refactoring to patterns', published: 2004, author: 'Joshua Kerievsky', id: "afa5de01-344d-11e9-a414-719c6709cf3e", genres: ['refactoring', 'patterns'] },  
  { title: 'Practical Object-Oriented Design in Ruby', published: 2012, author: 'Sandi Metz', id: "afa5de02-344d-11e9-a414-719c6709cf3e", genres: ['design', 'patterns'] },
  { title: 'Crime and Punishment', published: 1866, author: 'Fyodor Dostoevsky', id: "afa5de03-344d-11e9-a414-719c6709cf3e", genres: ['classic', 'crime'] },
  { title: 'The Idiot', published: 1869, author: 'Fyodor Dostoevsky', id: "afa5de04-344d-11e9-a414-719c6709cf3e", genres: ['classic', 'fantasy'] },
]

const typeDefs = `
  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int! # <--- ADDED for 8.5
  }

  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    # ADDED parameters for 8.4
    allBooks(author: String, genre: String): [Book!]! 
    allAuthors: [Author!]!
  }
    type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`
const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allAuthors: () => authors,
    allBooks: (root, args) => {
      let filteredBooks = books
      if (args.author) {
        filteredBooks = filteredBooks.filter(b => b.author === args.author)
      }
      if (args.genre) {
        filteredBooks = filteredBooks.filter(b => b.genres.includes(args.genre))
      }
      return filteredBooks
    }
  }, // <--- This closes the Query block

  Mutation: { // <--- Mutation is now at the same level as Query
    addBook: (root, args) => {
      const book = { ...args, id: Math.random().toString(36).substring(2) }
      books = books.concat(book)

      if (!authors.find(a => a.name === args.author)) {
        const newAuthor = { name: args.author, id: Math.random().toString(36).substring(2) }
        authors = authors.concat(newAuthor)
      }

      return book
    },
    editAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name)
      if (!author) {
        return null
      }

      const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
      return updatedAuthor
    }
  }, // <--- This closes the Mutation block

  Author: {
    bookCount: (root) => {
      return books.filter(b => b.author === root.name).length
    }
  }
}
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})