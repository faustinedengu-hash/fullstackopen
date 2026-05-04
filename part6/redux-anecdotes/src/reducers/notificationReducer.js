import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '', // Starts as an empty string (no notification)
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return '' // Resets back to empty
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer