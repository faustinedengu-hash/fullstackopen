import { useSelector } from 'react-redux'

const Notification = () => {
  // This grabs the current notification message from the Redux store
  const notification = useSelector(state => state.notification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  // If there is no message, we render nothing (the box disappears)
  if (notification === '') {
    return null
  }

  // If there is a message, we show the box with the text
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification