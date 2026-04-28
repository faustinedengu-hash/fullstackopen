import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  // CSS for the blog border and spacing
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
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} 
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {/* This section only renders if visible is true */}
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} 
            <button>like</button>
          </div>
          <div>{blog.user ? blog.user.name : 'unknown user'}</div>
        </div>
      )}
    </div>
  )
}

export default Blog