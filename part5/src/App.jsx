import { useState, useEffect } from 'react'
import { Routes, Route, Link, useParams } from 'react-router-dom'
import { 
  Container, TextField, Button, AppBar, Toolbar, 
  IconButton, Table, TableBody, TableCell, TableContainer, 
  TableRow, Paper, TableHead 
} from '@mui/material'

import Blog from './components/Blog' 
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import Notification from './components/Notification' 
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const User = ({ users }) => {
  const id = useParams().id
  const user = users.find(u => u.id === id)
  if (!user) return <p>User not found</p>

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog => <li key={blog.id}>{blog.title}</li>)}
      </ul>
    </div>
  )
}

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
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <div><a href={blog.url}>{blog.url}</a></div>
      <div>
        {blog.likes} likes 
        <Button size="small" variant="outlined" onClick={() => handleLike(blog)}>like</Button>
      </div>
      <div>added by {blog.user ? blog.user.name : 'unknown'}</div>

      <h3>comments</h3>
      <form onSubmit={onSubmitComment}>
        <TextField 
          size="small" 
          value={comment} 
          onChange={({ target }) => setComment(target.value)} 
        />
        <Button variant="contained" type="submit" style={{ marginLeft: 5 }}>add comment</Button>
      </form>
      <ul>
        {(blog.comments || []).map((c, index) => <li key={index}>{c}</li>)}
      </ul>
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [users, setUsers] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  })

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))   
    userService.getAll().then(initialUsers => setUsers(initialUsers))
  }, [])

  useEffect(() => {
    if (user) blogService.setToken(user.token)
  }, [user])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user)) 
      blogService.setToken(user.token) 
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationType('error')
      setNotificationMessage('wrong username or password')
      setTimeout(() => setNotificationMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotificationType('success')
      setNotificationMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => setNotificationMessage(null), 5000)
    } catch (error) {
      setNotificationType('error')
      setNotificationMessage('error adding blog')
      setTimeout(() => setNotificationMessage(null), 5000)
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } catch (error) {
        setNotificationType('error')
        setNotificationMessage('error: could not delete blog')
        setTimeout(() => setNotificationMessage(null), 5000)
      }
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = { ...blog, likes: (blog.likes || 0) + 1, user: blog.user.id || blog.user }
    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))
    } catch (error) {
      setNotificationType('error')
      setNotificationMessage('error: could not update likes')
      setTimeout(() => setNotificationMessage(null), 5000)
    }
  }

  const handleComment = async (id, comment) => {
    try {
      const updatedBlog = await blogService.addComment(id, comment)
      setBlogs(blogs.map(b => b.id !== id ? b : updatedBlog))
    } catch (error) {
      setNotificationType('error')
      setNotificationMessage('error: could not add comment')
      setTimeout(() => setNotificationMessage(null), 5000)
    }
  }

  if (user === null) {
    return (
      <Container>
        <h2>Log in to application</h2>
        <Notification message={notificationMessage} type={notificationType} />
        <form onSubmit={handleLogin}>
          <div><TextField label="username" value={username} onChange={({ target }) => setUsername(target.value)} margin="normal" /></div>
          <div><TextField label="password" type="password" value={password} onChange={({ target }) => setPassword(target.value)} margin="normal" /></div>
          <Button variant="contained" color="primary" type="submit">login</Button>
        </form>
      </Container>
    )
  }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">blogs</Button>
          <Button color="inherit" component={Link} to="/users">users</Button>
          <div style={{ marginLeft: 'auto' }}>
            <em>{user.name} logged in</em>
            <Button color="inherit" onClick={handleLogout}>logout</Button>
          </div>
        </Toolbar>
      </AppBar>

      <h2>blog app</h2>
      <Notification message={notificationMessage} type={notificationType} />

      <Routes>
        <Route path="/" element={
          <div>
            <Togglable buttonLabel='new blog'>
              <BlogForm createBlog={addBlog} />
            </Togglable>
            {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
              <Blog key={blog.id} blog={blog} handleDelete={() => handleDelete(blog)} user={user} />
            )}
          </div>
        } />

        <Route path="/users" element={
          <div>
            <h2>Users</h2>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell><strong>blogs created</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(u => (
                    <TableRow key={u.id}>
                      <TableCell><Link to={`/users/${u.id}`}>{u.name}</Link></TableCell>
                      <TableCell>{u.blogs.length}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        } />

        <Route path="/users/:id" element={<User users={users} />} />
        <Route path="/blogs/:id" element={<BlogView blogs={blogs} handleLike={handleLike} handleComment={handleComment} />} />
      </Routes>
    </Container>
  )
}

export default App