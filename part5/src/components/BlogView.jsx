import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { 
  Box, Paper, Typography, Button, Divider, 
  TextField, List, ListItem, ListItemText 
} from '@mui/material'

const BlogView = ({ blogs, handleLike, handleComment }) => {
  const [comment, setComment] = useState('')
  const id = useParams().id
  const blog = blogs.find(b => b.id === id)

  if (!blog) return null

  const onSubmitComment = (event) => {
    event.preventDefault()
    handleComment(blog.id, comment)
    setComment('')
  }

  return (
    <Box sx={{ marginTop: 3 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          by {blog.author}
        </Typography>
        
        <Box sx={{ my: 2 }}>
          <Typography variant="body1">
            <strong>URL:</strong> <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h6">{blog.likes} likes</Typography>
          <Button variant="outlined" color="primary" onClick={() => handleLike(blog)}>
            Like
          </Button>
        </Box>

        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
          added by <strong>{blog.user ? blog.user.name : 'unknown'}</strong>
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h5" gutterBottom>Comments</Typography>
        
        <Box component="form" onSubmit={onSubmitComment} sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <TextField
            label="Write a comment..."
            size="small"
            fullWidth
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
          <Button variant="contained" type="submit">
            add comment
          </Button>
        </Box>

        <List>
          {(blog.comments || []).map((c, index) => (
            <div key={index}>
              <ListItem sx={{ px: 0 }}>
                <ListItemText primary={c} />
              </ListItem>
              <Divider variant="inset" component="li" sx={{ ml: 0 }} />
            </div>
          ))}
        </List>
      </Paper>
    </Box>
  )
}

export default BlogView