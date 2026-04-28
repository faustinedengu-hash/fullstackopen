import { useState } from 'react'

// ADD updateLikes HERE in the props!
const Blog = ({ blog, updateLikes }) => { 
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
    <div style={blogStyle}>
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
            {/* Now updateLikes is defined and will work! */}
            <button onClick={updateLikes}>like</button>
          </div>
          <div>{blog.user ? blog.user.name : 'unknown user'}</div>
        </div>
      )}
    </div>
  )
}

export default Blog