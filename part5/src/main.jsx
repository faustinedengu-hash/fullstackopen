import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationContextProvider } from './NotificationContext'
import { UserContextProvider } from './UserContext' // <-- NEW IMPORT
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>        {/* <-- NEW PROVIDER */}
        <NotificationContextProvider>
          <Router>
            <App />
          </Router>
        </NotificationContextProvider>
      </UserContextProvider>
    </QueryClientProvider>
  </StrictMode>,
)