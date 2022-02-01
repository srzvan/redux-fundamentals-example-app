import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { actions as todoActions } from '../features/todos/todosSlice'

function Header() {
  const dispatch = useDispatch()

  const [text, setText] = useState('')

  const handleChange = (e) => setText(e.target.value)

  const handleKeyDown = (e) => {
    const trimmedText = e.target.value.trim()

    if (e.key === 'Enter' && trimmedText) {
      dispatch({ type: todoActions.ADD_TODO, payload: trimmedText })
      setText('')
    }
  }

  return (
    <header className="header">
      <input
        value={text}
        className="new-todo"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="What needs to be done?"
      />
    </header>
  )
}

export default Header
