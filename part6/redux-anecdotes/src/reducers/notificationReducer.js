import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    // We rename these so the Thunk can use the name 'setNotification'
    showNotification(state, action) {
      return action.payload
    },
    hideNotification() {
      return ''
    }
  }
})

export const { showNotification, hideNotification } = notificationSlice.actions

// NEW THUNK: Handles setting the message AND clearing it after X seconds!
export const setNotification = (message, timeInSeconds) => {
  return async dispatch => {
    dispatch(showNotification(message))
    
    setTimeout(() => {
      dispatch(hideNotification())
    }, timeInSeconds * 1000) // Multiply by 1000 to convert seconds to milliseconds
  }
}

export default notificationSlice.reducer