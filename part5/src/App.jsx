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
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

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
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
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
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (exception) {
      setNotificationMessage('error adding blog')
      setNotificationType('error')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }
  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        // Filter out the deleted blog from the state to refresh the UI
        setBlogs(blogs.filter(b => b.id !== blog.id))
        
        setNotificationMessage(`Deleted ${blog.title}`)
        setNotificationType('success')
        setTimeout(() => setNotificationMessage(null), 5000)
      } catch (exception) {
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
    } catch (exception) {
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
          <div>username <input value={username} onChange={({ target }) => setUsername(target.value)} /></div>
          <div>password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} /></div>
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
            deleteBlog={() => handleDelete(blog)} // Pass the delete function
            user={user} // Pass the logged-in user
          />
        )
      }
    </div>
  )
} // <--- The missing closing brace for the App component

export default App