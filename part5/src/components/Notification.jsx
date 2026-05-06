import { Alert } from '@mui/material'
import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  // If the context state is null, don't render anything
  if (!notification) {
    return null
  }

  // MUI Alert uses 'error' or 'success' as severity
  const severity = notification.type === 'error' ? 'error' : 'success'

  return (
    <Alert severity={severity} sx={{ marginBottom: 2 }}>
      {notification.message}
    </Alert>
  )
}

export default Notification