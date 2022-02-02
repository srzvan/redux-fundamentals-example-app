import { createSelector } from 'reselect'

import { client } from '../../api/client'
import { StatusFilters } from '../filters/filtersSlice'

export const statusTypes = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
}

const initialState = {
  status: statusTypes.IDLE,
  entities: [],
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

export const selectTodos = (state) => state.todos.entities

export const selectTodoById = (state, id) =>
  selectTodos(state).find((todo) => todo.id === id)

export const selectTodoIds = createSelector(selectTodos, (todos) =>
  todos.map((todo) => todo.id)
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

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.TODOS_LOADING:
      return {
        ...state,
        status: statusTypes.LOADING,
      }
    case actionTypes.TODOS_LOADED: {
      return { ...state, status: statusTypes.IDLE, entities: action.payload }
    }
    case actionTypes.ADD_TODO: {
      return { ...state, entities: [...state.entities, action.payload] }
    }
    case actionTypes.DELETE_TODO: {
      return {
        ...state,
        entities: state.entities.filter(
          (todo) => todo.id !== action.payload.id
        ),
      }
    }
    case actionTypes.TOGGLE_TODO: {
      return {
        ...state,
        entities: state.entities.map((todo) => {
          if (todo.id !== action.payload) {
            return todo
          }

          return {
            ...todo,
            completed: !todo.completed,
          }
        }),
      }
    }
    case actionTypes.CHANGE_TODO_COLOR: {
      return {
        ...state,
        entities: state.entities.map((todo) => {
          if (todo.id !== action.payload.id) {
            return todo
          }

          return {
            ...todo,
            color: action.payload.color,
          }
        }),
      }
    }
    case actionTypes.COMPLETE_ALL_TODOS: {
      return {
        ...state,
        entities: state.entities.map((todo) => {
          if (todo.completed) {
            return todo
          }

          return {
            ...todo,
            completed: true,
          }
        }),
      }
    }
    case actionTypes.CLEAR_COMPLETED_TODOS: {
      return {
        ...state,
        entities: state.entities.filter((todo) => !todo.completed),
      }
    }
    default:
      return state
  }
}

export function fetchTodos() {
  return async function fetchTodosThunk(dispatch, _) {
    dispatch(actionCreators.todosLoading())

    const response = await client.get('/fakeApi/todos')
    dispatch(actionCreators.todosLoaded(response.todos))
  }
}

export function saveTodo(text) {
  return async function saveTodoThunk(dispatch, _) {
    const response = await client.post('/fakeApi/todos', { todo: { text } })

    dispatch(actionCreators.todoAdded(response.todo))
  }
}
