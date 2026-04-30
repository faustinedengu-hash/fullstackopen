import { useState, useEffect } from 'react'
import { Routes, Route, Link, useParams } from 'react-router-dom'
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

  if (!user) {
    return <p>User not found</p>
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
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
    if (user) {
      blogService.setToken(user.token)
    }
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
      setTimeout(() => { setNotificationMessage(null) }, 5000)
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
        setNotificationType('success')
        setNotificationMessage(`Deleted ${blog.title}`)
        setTimeout(() => setNotificationMessage(null), 5000)
      } catch (error) {
        setNotificationType('error')
        setNotificationMessage('error: could not delete blog')
        setTimeout(() => setNotificationMessage(null), 5000)
      }
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notificationMessage} type={notificationType} />
        <form onSubmit={handleLogin}>
          <div>username <input name="Username" value={username} onChange={({ target }) => setUsername(target.value)} /></div>
          <div>password <input name="Password" type="password" value={password} onChange={({ target }) => setPassword(target.value)} /></div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <nav style={{ background: '#eee', padding: '10px', marginBottom: '10px' }}>
        <Link style={{ padding: '5px' }} to="/">blogs</Link>
        <Link style={{ padding: '5px' }} to="/users">users</Link>
      </nav>

      <h2>blog app</h2>
      <Notification message={notificationMessage} type={notificationType} />

      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

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
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th><strong>blogs created</strong></th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td><Link to={`/users/${u.id}`}>{u.name}</Link></td>
                    <td>{u.blogs.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        } />

        <Route path="/users/:id" element={<User users={users} />} />
      </Routes>
    </div>
  )
}

export default App