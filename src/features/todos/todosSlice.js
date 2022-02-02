import { createSelector } from 'reselect'

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

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.TODOS_LOADING:
      return {
        ...state,
        status: APICallStatusTypes.LOADING,
      }
    case actionTypes.TODOS_LOADED: {
      const newEntities = {}

      action.payload.forEach((todo) => (newEntities[todo.id] = todo))

      return {
        ...state,
        status: APICallStatusTypes.IDLE,
        entities: newEntities,
      }
    }
    case actionTypes.ADD_TODO: {
      const todo = action.payload

      return {
        ...state,
        entities: { ...state.entities, [todo.id]: todo },
      }
    }
    case actionTypes.DELETE_TODO: {
      const id = action.payload
      const newEntities = { ...state.entities }

      delete newEntities[id]

      return {
        ...state,
        entities: newEntities,
      }
    }
    case actionTypes.TOGGLE_TODO: {
      const id = action.payload
      const todo = state.entities[id]

      return {
        ...state,
        entities: {
          ...state.entities,
          [id]: {
            ...todo,
            completed: !todo.completed,
          },
        },
      }
    }
    case actionTypes.CHANGE_TODO_COLOR: {
      const { id, color } = action.payload
      const todo = state.entities[id]

      return {
        ...state,
        entities: {
          ...state.entities,
          [id]: {
            ...todo,
            color,
          },
        },
      }
    }
    case actionTypes.COMPLETE_ALL_TODOS: {
      const newEntities = { ...state.entities }

      Object.values(newEntities).forEach((todo) => {
        if (!todo.completed) {
          newEntities[todo.id] = {
            ...todo,
            completed: true,
          }
        }
      })

      return {
        ...state,
        entities: newEntities,
      }
    }
    case actionTypes.CLEAR_COMPLETED_TODOS: {
      const newEntities = { ...state.entities }

      Object.values(newEntities).forEach((todo) => {
        if (todo.completed) {
          delete newEntities[todo.id]
        }
      })

      return {
        ...state,
        entities: newEntities,
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
