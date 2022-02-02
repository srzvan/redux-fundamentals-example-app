import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  todoToggled,
  todoDeleted,
  todoColorChanged,
  selectFilteredTodoIds,
} from './todosSlice'
import TodoListItem from './TodoListItem'
import { APICallStatusTypes } from '../../utils'

function TodoList() {
  const todoIds = useSelector(selectFilteredTodoIds)
  const status = useSelector((state) => state.todos.status)

  const dispatch = useDispatch()

  if (status === APICallStatusTypes.LOADING) {
    return (
      <div className="todo-list">
        <div className="loader" />
      </div>
    )
  }

  return (
    <ul className="todo-list">
      {todoIds.map((id) => {
        const onColorChange = (color) => dispatch(todoColorChanged(id, color))
        const onCompletedChange = () => dispatch(todoToggled(id))
        const onDelete = () => dispatch(todoDeleted(id))

        return (
          <TodoListItem
            id={id}
            key={id}
            onDelete={onDelete}
            onColorChange={onColorChange}
            onCompletedChange={onCompletedChange}
          />
        )
      })}
    </ul>
  )
}

export default TodoList
