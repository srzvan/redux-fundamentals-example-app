import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { APICallStatusTypes } from '../utils'
import { saveTodo } from '../features/todos/todosSlice'

function Header() {
  const dispatch = useDispatch()

  const [text, setText] = useState('')
  const [status, setStatus] = useState(APICallStatusTypes.IDLE)

  const handleChange = (e) => setText(e.target.value)

  const handleKeyDown = async (e) => {
    const trimmedText = e.target.value.trim()

    if (e.key === 'Enter' && trimmedText) {
      setStatus(APICallStatusTypes.LOADING)

      await dispatch(saveTodo(trimmedText))
      setText('')

      setStatus(APICallStatusTypes.IDLE)
    }
  }

  const isLoading = status === APICallStatusTypes.LOADING
  const placeholder = isLoading ? '' : 'What needs to be done?'
  const loader = isLoading ? <div className="loader" /> : null

  return (
    <header className="header">
      <input
        value={text}
        className="new-todo"
        disabled={isLoading}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {loader}
    </header>
  )
}

export default Header
