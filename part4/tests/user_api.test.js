const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  // Seed one user so we can test the "unique" requirement
  const passwordHash = 'secret-hash'
  const user = new User({ 
    username: 'mluukkai', 
    name: 'Matti Luukkainen', 
    passwordHash 
  })
  await user.save()
})

test('creation fails with proper status if username already exists', async () => {
  const newUser = {
    username: 'mluukkai', // Duplicate!
    name: 'Duplicate User',
    password: 'password123',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert(result.body.error.includes('expected `username` to be unique'))
})

test('creation fails if password is too short', async () => {
  const newUser = {
    username: 'newuser',
    name: 'New User',
    password: '12' // Too short!
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert(result.body.error.includes('password must be at least 3 characters long'))
})

test('creation fails if username is too short', async () => {
  const newUser = {
    username: 'ml', // Too short!
    name: 'Short Username',
    password: 'securepassword'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert(result.body.error.includes('username must be at least 3 characters long'))
})

after(async () => {
  await mongoose.connection.close()
})