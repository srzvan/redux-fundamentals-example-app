import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  selectFilteredTodoIds,
  statusTypes as todosStatusTypes,
  actionCreators as todosActionCreators,
} from './todosSlice'
import TodoListItem from './TodoListItem'

function TodoList() {
  const todoIds = useSelector(selectFilteredTodoIds)
  const status = useSelector((state) => state.todos.status)

  const dispatch = useDispatch()

  if (status === todosStatusTypes.LOADING) {
    return (
      <div className="todo-list">
        <div className="loader" />
      </div>
    )
  }

  return (
    <ul className="todo-list">
      {todoIds.map((id) => {
        const onColorChange = (color) =>
          dispatch(todosActionCreators.todoColorChanged(id, color))
        const onCompletedChange = () =>
          dispatch(todosActionCreators.todoToggled(id))
        const onDelete = () => dispatch(todosActionCreators.todoDeleted(id))

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
