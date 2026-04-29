import { useState, useEffect } from 'react'
import Blog from './components/Blog' 
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification' 
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

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

  // Load blogs on startup
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

  // Ensure token is set if user is logged in
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
      // FIXED: Changed setErrorMessage to setNotificationMessage
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
      // Added console.error so you can see if something else breaks
      console.error('Add blog failed:', error)
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

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: (blog.likes || 0) + 1,
      // Robust check for the user ID
      user: blog.user.id || blog.user 
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))
    } catch (error) {
      setNotificationType('error')
      setNotificationMessage('error: could not update likes')
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