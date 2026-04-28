import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: { name: 'Test User' }
  }

  // We mock a user object since the Blog component expects one
  const user = { username: 'testuser' }

  render(<Blog blog={blog} user={user} />)

  // 1. Check that title and author are there
  const element = screen.getByText('Component testing is done with react-testing-library Test Author')
  expect(element).toBeDefined()

  // 2. Check that the URL and likes are NOT being rendered
  // We search for the text, and expect it to NOT be in the document
  const url = screen.queryByText('http://testurl.com')
  expect(url).toBeNull()

  const likes = screen.queryByText('likes 5')
  expect(likes).toBeNull()
})