import { createSelector, createSlice } from '@reduxjs/toolkit'

import { client } from '../../api/client'
import { APICallStatusTypes } from '../../utils'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = {
  status: APICallStatusTypes.IDLE,
  entities: {},
}

const actionTypes = {
  ADD_TODO: 'todos/ADD_TODO',
  DELETE_TODO: 'todos/DELETE_TODO',
  TOGGLE_TODO: 'todos/TOGGLE_TODO',
  TODOS_LOADED: 'todos/TODOS_LOADED',
  TODOS_LOADING: 'todos/TODOS_LOADING',
  CHANGE_TODO_COLOR: 'todos/CHANGE_TODO_COLOR',
  COMPLETE_ALL_TODOS: 'todos/COMPLETE_ALL_TODOS',
  CLEAR_COMPLETED_TODOS: 'todos/CLEAR_COMPLETED_TODOS',
}

export const actionCreators = {
  todosLoading: () => ({
    type: actionTypes.TODOS_LOADING,
  }),
  todosLoaded: (todos) => ({
    type: actionTypes.TODOS_LOADED,
    payload: todos,
  }),
  todoAdded: (todo) => ({
    type: actionTypes.ADD_TODO,
    payload: todo,
  }),
  todoDeleted: (id) => ({
    type: actionTypes.DELETE_TODO,
    payload: id,
  }),
  todoToggled: (id) => ({
    type: actionTypes.TOGGLE_TODO,
    payload: id,
  }),
  todoColorChanged: (id, color) => ({
    type: actionTypes.CHANGE_TODO_COLOR,
    payload: { id, color },
  }),
  completeAll: () => ({
    type: actionTypes.COMPLETE_ALL_TODOS,
  }),
  clearAllCompleted: () => ({
    type: actionTypes.CLEAR_COMPLETED_TODOS,
  }),
}

const selectTodoEntities = (state) => state.todos.entities

export const selectTodos = createSelector(selectTodoEntities, (entities) =>
  Object.values(entities)
)

export const selectTodoById = (state, id) => selectTodoEntities(state)[id]

export const selectTodoIds = createSelector(selectTodos, (todos) =>
  Object.keys(todos)
)

export const selectFilteredTodos = createSelector(
  selectTodos,
  (state) => state.filters,
  (todos, filters) => {
    const { status, colors } = filters
    const showAll = status === StatusFilters.All

    if (showAll && colors.length === 0) {
      return todos
    }

    return todos.filter((todo) => {
      const completedStatus = status === StatusFilters.Completed
      const statusFilter = showAll || todo.completed === completedStatus
      const colorFilter = colors.length === 0 || colors.includes(todo.color)

      return statusFilter && colorFilter
    })
  }
)

export const selectFilteredTodoIds = createSelector(
  selectFilteredTodos,
  (filteredTodos) => filteredTodos.map((todo) => todo.id)
)

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action) {
      const todo = action.payload

      state.entities[todo.id] = todo
    },
    todoDeleted(state, action) {
      const id = action.payload

      delete state.entities[id]
    },
    todoToggled(state, action) {
      const id = action.payload
      const todo = state.entities[id]

      todo.completed = !todo.completed
    },
    todosLoaded(state, action) {
      const todos = action.payload

      state.status = APICallStatusTypes.IDLE
      todos.forEach((todo) => {
        state.entities[todo.id] = todo
      })
    },
    todosLoading(state, _) {
      state.status = APICallStatusTypes.LOADING
    },
    todoColorChanged: {
      reducer(state, action) {
        const { id, color } = action.payload
        const todo = state.entities[id]

        todo.color = color
      },
      prepare(id, color) {
        return {
          payload: { id, color },
        }
      },
    },
    completeAllTodos(state, _) {
      Object.values(state.entities).forEach((todo) => {
        if (!todo.completed) {
          todo.completed = true
        }
      })
    },
    clearAllCompletedTodos(state, _) {
      Object.values(state.entities).filter((todo) => !todo.completed)
    },
  },
})

export const {
  todoAdded,
  todoDeleted,
  todoToggled,
  todosLoaded,
  todosLoading,
  todoColorChanged,
  completeAllTodos,
  clearAllCompletedTodos,
} = todosSlice.actions

export default todosSlice.reducer

export function fetchTodos() {
  return async function fetchTodosThunk(dispatch, _) {
    dispatch(todosLoading())

    const response = await client.get('/fakeApi/todos')
    dispatch(todosLoaded(response.todos))
  }
}

export function saveTodo(text) {
  return async function saveTodoThunk(dispatch, _) {
    const response = await client.post('/fakeApi/todos', { todo: { text } })

    dispatch(todoAdded(response.todo))
  }
}
