const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

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

after(async () => {
  await mongoose.connection.close()
})