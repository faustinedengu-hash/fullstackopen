const { GraphQLError } = require('graphql')
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
      let author = await Author.findOne({ name: args.author })
      
      try {
        if (!author) {
          author = new Author({ name: args.author })
          await author.save()
        }
        
        const book = new Book({ ...args, author: author._id })
        await book.save()
        
        return book.populate('author')
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) return null

      author.born = args.setBornTo
      
      try {
        await author.save()
        return author
      } catch (error) {
        throw new GraphQLError('Editing author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
    }
  }
} // <--- THIS WAS THE MISSING BRACKET!

// Make sure you still have const cors = require('cors') at the very top of your file!

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Startup with CORS put back in
startStandaloneServer(server, {
  listen: { port: 4000 },
  cors: {
    origin: ['http://localhost:5173'], 
    credentials: true
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})