import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'
const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [], // We start completely empty now!
  reducers: {
    createAnecdote(state, action) {
      // We will update this in the next exercise to talk to the DB
      state.push(action.payload)
    },
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(a => a.id === id)
      if (anecdoteToChange) {
        anecdoteToChange.votes += 1
      }
    },
    // NEW: This action grabs the DB data and puts it in Redux
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

// Don't forget to export the new setAnecdotes action!
export const { createAnecdote, voteAnecdote, setAnecdotes } = anecdoteSlice.actions
export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}
export const createNewAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }
}
export default anecdoteSlice.reducer