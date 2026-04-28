import { useState } from 'react'

const Blog = ({ blog, updateLikes, deleteBlog, user }) => { 
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} {blog.author} 
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} 
            <button onClick={updateLikes}>like</button>
          </div>
          <div>{blog.user ? blog.user.name : 'unknown user'}</div>
          
          {/* This button MUST be inside this parent <div> */}
          {blog.user && user && (blog.user.username === user.username) && (
            <button 
              style={{ backgroundColor: 'lightblue', marginTop: 5 }} 
              onClick={deleteBlog}
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog