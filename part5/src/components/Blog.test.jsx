import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event' // Required for 5.14
import Blog from './Blog'

// Test for Exercise 5.13
test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: { name: 'Test User' }
  }

  const user = { username: 'testuser' }

  render(<Blog blog={blog} user={user} />)

  // Check title and author
  const element = screen.getByText('Component testing is done with react-testing-library Test Author')
  expect(element).toBeDefined()

  // Check URL and likes are HIDDEN
  const url = screen.queryByText('http://testurl.com')
  expect(url).toBeNull()

  const likes = screen.queryByText('likes 5')
  expect(likes).toBeNull()
}) // <--- End of first test

// Test for Exercise 5.14
test('clicking the view button displays url and likes', async () => {
  const blog = {
    title: 'Testing button clicks with user-event',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: { name: 'Test User' }
  }

  const userProp = { username: 'testuser' }

  render(<Blog blog={blog} user={userProp} />)

  // 1. Setup the user session
  const user = userEvent.setup()
  
  // 2. Find the button and click it
  const button = screen.getByText('view')
  await user.click(button)

  // 3. Verify that the URL and likes are now visible
  const url = screen.getByText('http://testurl.com')
  expect(url).toBeDefined()

  const likes = screen.getByText('likes 5')
  expect(likes).toBeDefined()
}) // <--- End of second test