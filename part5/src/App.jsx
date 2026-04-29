import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import { useState, useEffect } from 'react'
import Blog from './components/Blog' 
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification' 

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
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
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
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
      setNotificationMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setNotificationType('success')
      setTimeout(() => setNotificationMessage(null), 5000)
    } catch {
      setNotificationMessage('error adding blog')
      setNotificationType('error')
      setTimeout(() => setNotificationMessage(null), 5000)
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setNotificationMessage(`Deleted ${blog.title}`)
        setNotificationType('success')
        setTimeout(() => setNotificationMessage(null), 5000)
      } catch {
        setNotificationMessage('error: could not delete blog')
        setNotificationType('error')
        setTimeout(() => setNotificationMessage(null), 5000)
      }
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id 
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))
    } catch {
      setNotificationMessage('error: could not update likes')
      setNotificationType('error')
      setTimeout(() => setNotificationMessage(null), 5000)
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
      <h2>blogs</h2>
      <Notification message={notificationMessage} type={notificationType} /> 
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <Togglable buttonLabel="new blog">
        <BlogForm createBlog={addBlog} />
      </Togglable>
      
      {[...blogs]
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .map(blog =>
          <Blog 
            key={blog.id} 
            blog={blog} 
            updateLikes={() => handleLike(blog)} 
            deleteBlog={() => handleDelete(blog)} 
            user={user} 
          />
        )
      }
    </div>
  )
}

export default App