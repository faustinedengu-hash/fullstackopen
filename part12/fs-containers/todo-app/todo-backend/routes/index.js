const express = require('express');
const router = express.Router();
const redis = require('../redis'); // WE IMPORT REDIS HERE

const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({ message: "hello faustine", visits });
});

/* EXERCISE 12.10: GET statistics */
router.get('/statistics', async (req, res) => {
  // Fetch the count from Redis, default to 0 if it doesn't exist yet
  const addedTodos = await redis.get('added_todos');
  const count = addedTodos ? parseInt(addedTodos) : 0;
  
  res.send({ added_todos: count });
});

module.exports = router;