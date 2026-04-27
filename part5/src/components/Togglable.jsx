import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  // These CSS rules decide what is shown based on the 'visible' state
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      {/* This shows the "new blog" button when the form is hidden */}
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      
      {/* This shows the form (props.children) and a "cancel" button when visible is true */}
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable