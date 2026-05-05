import { useNavigate } from 'react-router-dom'
// 1. Import our custom hook
import { useField } from '../hooks' 

const CreateNew = ({ addAnecdote, setNotification }) => {
  // 2. Use the hook instead of useState!
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Because our hook returns an object { type, value, onChange }, 
    // we must grab the .value property when we submit!
    addAnecdote({ 
      content: content.value, 
      author: author.value, 
      info: info.value, 
      votes: 0 
    })
    
    setNotification(`A new anecdote '${content.value}' created!`)
    
    setTimeout(() => {
      setNotification('')
    }, 5000)
    
    navigate('/')
  }
  const handleReset = (e) => {
    e.preventDefault()
    content.reset()
    author.reset()
    info.reset()
  }
  const { reset: resetContent, ...contentInput } = content
  const { reset: resetAuthor, ...authorInput } = author
  const { reset: resetInfo, ...infoInput } = info

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          {/* 3. The Spread Operator unpacks type, value, and onChange for us! */}
          <input name='content' {...content} />
        </div>
        <div>
          author
          <input name='author' {...author} />
        </div>
        <div>
          url for more info
          url for more info
          <input name='info' {...infoInput} />
        </div>
        <button type="submit">create</button>
        {/* NEW: The reset button */}
        <button onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew