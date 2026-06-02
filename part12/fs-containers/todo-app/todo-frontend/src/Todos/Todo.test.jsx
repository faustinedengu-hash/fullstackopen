import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders todo text correctly', () => {
  const todo = {
    text: 'Docker automated testing is working',
    done: false
  }

  render(
    <Todo todo={todo} onClickDelete={() => {}} onClickComplete={() => {}} />
  )

  const element = screen.getByText('Docker automated testing is working')
  expect(element).toBeDefined()
})