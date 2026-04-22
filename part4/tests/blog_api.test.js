const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt') // <-- Needed to create our test user password
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user') // <-- Needed to create our test user

const api = supertest(app)

let token = null // <-- This will hold our VIP wristband for the tests!

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Edsger W. Dijkstra',
    url: 'http://example.com',
    likes: 5
  },
  {
    title: 'Browser can execute only JavaScript',
    author: 'Edsger W. Dijkstra',
    url: 'http://example.com',
    likes: 10
  }
]

beforeEach(async () => {
  // 1. Clear both databases
  await User.deleteMany({})
  await Blog.deleteMany({})

  // 2. Create a test user
  const passwordHash = await bcrypt.hash('testpassword', 10)
  const user = new User({ username: 'testuser', passwordHash })
  await user.save()

  // 3. Log the test user in to get the token!
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'testpassword' })
  
  token = loginResponse.body.token

  // 4. Save the initial blogs, and attach them to our test user
  for (let blog of initialBlogs) {
    let blogObject = new Blog({ ...blog, user: user.id })
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const firstBlog = response.body[0]
  assert.ok(firstBlog.id)
  assert.strictEqual(firstBlog._id, undefined)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Async/Await simplifies making async calls',
    author: 'Test Master',
    url: 'https://testmaster.com',
    likes: 10
  }

  // Use the token in the header!
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) 
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)
  assert(titles.includes('Async/Await simplifies making async calls'))
})

test('if likes property is missing, it defaults to 0', async () => {
  const blogWithoutLikes = {
    title: 'This blog has no likes property',
    author: 'Lonely Writer',
    url: 'https://nolikes.com'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogWithoutLikes)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'No Title Author',
    url: 'https://notitle.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400) 
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'A blog with no URL',
    author: 'No URL Author',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400) 
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`) // Need the token to delete!
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)
  const contents = blogsAtEnd.body.map(r => r.title)
  assert(!contents.includes(blogToDelete.title))
})

test('a blog can be updated', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToUpdate = blogsAtStart.body[0]

  const updatedBlogData = {
    likes: blogToUpdate.likes + 1
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlogData)
    .expect(200)

  const blogsAtEnd = await api.get('/api/blogs')
  const updatedBlog = blogsAtEnd.body.find(b => b.id === blogToUpdate.id)
  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
})

// === EXERCISE 4.23: The 401 Unauthorized Test ===
test('adding a blog fails with status code 401 if token is not provided', async () => {
  const newBlog = {
    title: 'Unauthorized blog',
    author: 'Sneaky Hacker',
    url: 'http://sneaky.com',
    likes: 0
  }

  await api
    .post('/api/blogs')
    // Notice we do NOT set the Authorization header here!
    .send(newBlog)
    .expect(401)
})

after(async () => {
  await mongoose.connection.close()
})