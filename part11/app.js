const express = require('express')
const app = express()

// get the port from env variable
const PORT = process.env.PORT || 5000

app.use(express.static('dist'))

// 2026 UNIVERSITY STANDARD: Health check endpoint for zero-downtime orchestration
app.get('/health', (req, res) => {
  // EXERCISE 11.12: INTENTIONAL SABOTAGE TO TEST ROLLBACK
  res.status(500).send('error')
})

app.listen(PORT, () => {
})