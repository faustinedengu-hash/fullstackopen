const Blog = ({ blog }) => (
  <div style={{ padding: 10, border: 'solid', borderWidth: 1, marginBottom: 5 }}>
    <div>
      <strong>Title:</strong> {blog.title}
    </div>
    <div>
      <strong>Author:</strong> {blog.author}
    </div>
    <div>
      <strong>URL:</strong> {blog.url}
    </div>
  </div>
)

export default Blog