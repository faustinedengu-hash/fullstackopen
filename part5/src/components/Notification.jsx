import { Alert } from '@mui/material'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  // MUI Alert uses 'error' or 'success' as severity
  const severity = type === 'error' ? 'error' : 'success'

  return (
    <Alert severity={severity} sx={{ marginBottom: 2 }}>
      {message}
    </Alert>
  )
}

export default Notification