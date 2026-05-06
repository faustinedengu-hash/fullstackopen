import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Container, TextField, Button, AppBar, Toolbar, 
  Table, TableBody, TableCell, TableContainer, 
  TableRow, Paper, TableHead
} from '@mui/material'

import Blog from './components/Blog' 
import User from './components/User' // <-- NEW IMPORT
import BlogView from './components/BlogView' // <-- NEW IMPORT
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import Notification from './components/Notification' 
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import { useNotificationDispatch } from './NotificationContext'
import { useUserValue, useUserDispatch } from './UserContext'

const App = () => {
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 

  const user = useUserValue()
  const dispatchUser = useUserDispatch()

  const dispatchNotification = useNotificationDispatch()
  const notify = (message, type = 'success') => {
    dispatchNotification({ type: 'SET', payload: { message, type } })
    setTimeout(() => {
      dispatchNotification({ type: 'CLEAR' })
    }, 5000)
  }

  const queryClient = useQueryClient()

  const { data: blogs = [], isLoading: blogsLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false
  })

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false
  })

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const updateBlogMutation = useMutation({
    mutationFn: (updatedBlog) => blogService.update(updatedBlog.id, updatedBlog),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] })
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const commentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] })
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON)
      dispatchUser({ type: 'SET_USER', payload: parsedUser })
      blogService.setToken(parsedUser.token)
    }
  }, [dispatchUser])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedInUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedInUser)) 
      blogService.setToken(loggedInUser.token) 
      
      dispatchUser({ type: 'SET_USER', payload: loggedInUser })
      
      setUsername('')
      setPassword('')
      notify(`Welcome back ${loggedInUser.name}!`, 'success')
    } catch (exception) {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatchUser({ type: 'CLEAR_USER' })
    notify('Logged out successfully', 'success')
  }

  const addBlog = (blogObject) => {
    newBlogMutation.mutate(blogObject, {
      onSuccess: () => notify(`a new blog ${blogObject.title} by ${blogObject.author} added`, 'success'),
      onError: () => notify('error adding blog', 'error')
    })
  }

  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlogMutation.mutate(blog.id, {
        onSuccess: () => notify(`blog ${blog.title} removed`, 'success'),
        onError: () => notify('error: could not delete blog', 'error')
      })
    }
  }

  const handleLike = (blog) => {
    const updatedBlog = { ...blog, likes: (blog.likes || 0) + 1, user: blog.user.id || blog.user }
    updateBlogMutation.mutate(updatedBlog, {
      onError: () => notify('error: could not update likes', 'error')
    })
  }

  const handleComment = (id, comment) => {
    commentMutation.mutate({ id, comment }, {
      onError: () => notify('error: could not add comment', 'error')
    })
  }

  if (blogsLoading || usersLoading) {
    return <div>loading data...</div>
  }

  if (user === null) {
    return (
      <Container>
        <h2>Log in to application</h2>
        <Notification />
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
      <Notification />

      <Routes>
        <Route path="/" element={
          <div>
            <Togglable buttonLabel='new blog'>
              <BlogForm createBlog={addBlog} />
            </Togglable>
            {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
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