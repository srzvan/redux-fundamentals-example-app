import React from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import TodoListItem from './TodoListItem'
import { actions as todosActions } from './todosSlice'

const selectTodosIds = (state) => state.todos.map((todo) => todo.id)

function TodoList() {
  const todos = useSelector(selectTodosIds, shallowEqual)
  const dispatch = useDispatch()

  return (
    <ul className="todo-list">
      {todos.map((id) => {
        const onColorChange = (color) =>
          dispatch({
            type: todosActions.CHANGE_TODO_COLOR,
            payload: { color, id },
          })
        const onCompletedChange = (completed) =>
          dispatch({
            type: todosActions.TOGGLE_TODO,
            payload: { completed, id },
          })
        const onDelete = () =>
          dispatch({
            type: todosActions.DELETE_TODO,
            payload: { id },
          })

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
