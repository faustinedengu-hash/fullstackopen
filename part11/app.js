const express = require('express')
const app = express()

// get the port from env variable
const PORT = process.env.PORT || 5000

app.use(express.static('dist'))

// 2026 UNIVERSITY STANDARD: Health check endpoint for zero-downtime orchestration
app.get('/health', (req, res) => {
  res.send('ok')
})

app.listen(PORT, () => {
})
// Testing PR workflow
// Testing version tagging