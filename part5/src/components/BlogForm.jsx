import { useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleAddBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <Box sx={{ 
      marginBottom: 2, 
      padding: 2, 
      border: '1px solid #ddd', 
      borderRadius: 2,
      backgroundColor: '#fcfcfc' 
    }}>
      <Typography variant="h6" gutterBottom>create new</Typography>
      <form onSubmit={handleAddBlog}>
        <div>
          <TextField
            label="title"
            variant="outlined"
            size="small"
            margin="dense"
            fullWidth
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
            placeholder='title' 
          />
        </div>
        <div>
          <TextField
            label="author"
            variant="outlined"
            size="small"
            margin="dense"
            fullWidth
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
            placeholder='author' 
          />
        </div>
        <div>
          <TextField
            label="url"
            variant="outlined"
            size="small"
            margin="dense"
            fullWidth
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
            placeholder='url' 
          />
        </div>
        <Button 
          variant="contained" 
          color="primary" 
          type="submit" 
          sx={{ marginTop: 2 }}
        >
          create
        </Button>
      </form>
    </Box>
  )
}

export default BlogForm