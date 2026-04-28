import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  // Find the inputs (this depends on how you structured your inputs)
  // If you used placeholders like <input placeholder='write title here' />
  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  const sendButton = screen.getByText('create')

  // Simulate typing
  await user.type(titleInput, 'testing a form...')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'www.test.com')
  
  // Submit
  await user.click(sendButton)

  // Assertions
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
  expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
  expect(createBlog.mock.calls[0][0].url).toBe('www.test.com')
})