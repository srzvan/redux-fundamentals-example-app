import React from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import TodoListItem from './TodoListItem'
import { actionCreators as todosActionCreators } from './todosSlice'

const selectTodosIds = (state) => state.todos.map((todo) => todo.id)

function TodoList() {
  const todoIds = useSelector(selectTodosIds, shallowEqual)
  const dispatch = useDispatch()

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
