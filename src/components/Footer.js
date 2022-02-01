import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { capitalize } from '../utils'
import {
  StatusFilters,
  actions as filtersActions,
} from '../features/filters/filtersSlice'
import { availableColors } from '../features/filters/colors'

const selectRemainingTodos = (state) => {
  const remainingTodos = state.todos.filter((todo) => !todo.completed)

  return remainingTodos.length
}

function Footer() {
  const { status, colors } = useSelector((state) => state.filters)
  const todosRemaining = useSelector(selectRemainingTodos)

  const dispatch = useDispatch()

  const onColorChange = (color, changeType) =>
    dispatch({
      type: filtersActions.CHANGE_COLOR_FILTER,
      payload: {
        color,
        changeType,
      },
    })
  const onStatusChange = (status) =>
    dispatch({ type: filtersActions.CHANGE_STATUS_FILTER, payload: status })

  return (
    <footer className="footer">
      <div className="actions">
        <h5>Actions</h5>
        <button className="button">Mark All Completed</button>
        <button className="button">Clear Completed</button>
      </div>

      <RemainingTodos count={todosRemaining} />
      <StatusFilter value={status} onChange={onStatusChange} />
      <ColorFilters value={colors} onChange={onColorChange} />
    </footer>
  )
}

function RemainingTodos({ count }) {
  const suffix = count === 1 ? '' : 's'

  return (
    <div className="todo-count">
      <h5>Remaining Todos</h5>
      <p>
        <strong>{count}</strong> item{suffix} left
      </p>
    </div>
  )
}

function StatusFilter({ value: status, onChange }) {
  const renderedFilters = Object.keys(StatusFilters).map((key) => {
    const value = StatusFilters[key]
    const handleClick = () => onChange(value)
    const className = value === status ? 'selected' : ''

    return (
      <li key={value}>
        <button className={className} onClick={handleClick}>
          {key}
        </button>
      </li>
    )
  })

  return (
    <div className="filters statusFilters">
      <h5>Filter by Status</h5>
      <ul>{renderedFilters}</ul>
    </div>
  )
}

function ColorFilters({ value: colors, onChange }) {
  const renderedColors = availableColors.map((color) => {
    const checked = colors.includes(color)
    const handleChange = () => {
      const changeType = checked ? 'remove' : 'add'
      onChange(color, changeType)
    }

    return (
      <label key={color}>
        <input
          type="checkbox"
          name={color}
          checked={checked}
          onChange={handleChange}
        />
        <span
          className="color-block"
          style={{
            backgroundColor: color,
          }}
        ></span>
        {capitalize(color)}
      </label>
    )
  })

  return (
    <div className="filters colorFilters">
      <h5>Filter by Color</h5>
      <form className="colorSelection">{renderedColors}</form>
    </div>
  )
}

export default Footer
