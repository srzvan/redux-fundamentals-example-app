import React from 'react'
import { useSelector } from 'react-redux'

import { ReactComponent as TimesSolid } from './times-solid.svg'

import { capitalize } from '../../utils'
import { availableColors } from '../filters/colors'

const selectTodoById = (state, todoId) =>
  state.todos.find((todo) => todo.id === todoId)

function TodoListItem(props) {
  const { id, onColorChange, onCompletedChange, onDelete } = props

  const todo = useSelector((state) => selectTodoById(state, id))
  const { text, completed, color } = todo

  const handleCompletedChanged = (e) => {
    onCompletedChange(e.target.checked)
  }

  const handleColorChanged = (e) => {
    onColorChange(e.target.value)
  }

  const colorOptions = availableColors.map((c) => (
    <option key={c} value={c}>
      {capitalize(c)}
    </option>
  ))

  return (
    <li>
      <div className="view">
        <div className="segment label">
          <input
            type="checkbox"
            className="toggle"
            checked={completed}
            onChange={handleCompletedChanged}
          />
          <div className="todo-text">{text}</div>
        </div>
        <div className="segment buttons">
          <select
            value={color}
            style={{ color }}
            className="colorPicker"
            onChange={handleColorChanged}
          >
            <option value=""></option>
            {colorOptions}
          </select>
          <button className="destroy" onClick={onDelete}>
            <TimesSolid />
          </button>
        </div>
      </div>
    </li>
  )
}

export default TodoListItem
