import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom' // <-- 1. Add this import
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>    {/* <-- 2. Wrap App inside the Router */}
      <App />
    </Router>
  </StrictMode>,
)