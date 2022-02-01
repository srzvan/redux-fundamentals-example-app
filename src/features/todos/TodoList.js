import React from 'react'
import { useSelector } from 'react-redux'

import TodoListItem from './TodoListItem'

const selectTodos = (state) => state.todos

const TodoList = () => {
  const todos = useSelector(selectTodos)

  return (
    <ul className="todo-list">
      {todos.map((todo) => {
        return <TodoListItem key={todo.id} todo={todo} />
      })}
    </ul>
  )
}

export default TodoList
