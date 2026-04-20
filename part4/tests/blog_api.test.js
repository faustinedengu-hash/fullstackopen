const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog') // <--- Add this line!

const api = supertest(app)
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
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
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

  // 1. Send the POST request
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // 2. Fetch all blogs from the database
  const response = await api.get('/api/blogs')

  // 3. Verify the title of our new blog is in the data
  const titles = response.body.map(r => r.title)
  assert(titles.includes('Async/Await simplifies making async calls'))
})

test('if likes property is missing, it defaults to 0', async () => {
  const blogWithoutLikes = {
    title: 'This blog has no likes property',
    author: 'Lonely Writer',
    url: 'https://nolikes.com'
    // Notice: no 'likes' property here!
  }

  // Send the POST request
  const response = await api
    .post('/api/blogs')
    .send(blogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // Verify that the response has a likes property, and it equals 0
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
    .send(newBlog)
    .expect(400) // We expect a "Bad Request" error
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'A blog with no URL',
    author: 'No URL Author',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400) // We expect a "Bad Request" error here too
})
test('a blog can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
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

after(async () => {
  await mongoose.connection.close()
})