const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
require('dotenv').config()

const Author = require('./models/author')
const Book = require('./models/book')

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

// We will keep your typeDefs the same for now
const typeDefs = `
  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author! # Change: We want the full Author object now
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
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

// Next, we will rewrite the resolvers to use the Database...
const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    
    allAuthors: async () => {
      return Author.find({})
    },
    
    allBooks: async (root, args) => {
      let query = {}
      
      // If a genre is provided, filter by it
      if (args.genre) {
        query.genres = { $in: [args.genre] }
      }
      
      // If an author name is provided, find their ID first
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return [] // If author doesn't exist, they have no books
        query.author = author._id
      }
      
      // .populate('author') replaces the author ID with the full Author object
      return Book.find(query).populate('author')
    }
  },

  Author: {
    // Calculates how many books an author has in the database
    bookCount: async (root) => {
      return Book.countDocuments({ author: root._id })
    }
  },

  Mutation: {
    addBook: async (root, args) => {
      // 1. Check if author already exists in the database
      let author = await Author.findOne({ name: args.author })
      
      // 2. If not, create and save the new author first
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }
      
      // 3. Create the book and link it to the author's database ID
      const book = new Book({ ...args, author: author._id })
      await book.save()
      
      // 4. Return the book with the author details populated
      return book.populate('author')
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) return null

      author.born = args.setBornTo
      await author.save()
      return author
    }
  }
}
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Update the startup to handle CORS
startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})