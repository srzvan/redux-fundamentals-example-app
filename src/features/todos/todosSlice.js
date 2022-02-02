import { client } from '../../api/client'

const initialState = []

const actionTypes = {
  ADD_TODO: 'todos/ADD_TODO',
  DELETE_TODO: 'todos/DELETE_TODO',
  TOGGLE_TODO: 'todos/TOGGLE_TODO',
  TODOS_LOADED: 'todos/TODOS_LOADED',
  CHANGE_TODO_COLOR: 'todos/CHANGE_TODO_COLOR',
  COMPLETE_ALL_TODOS: 'todos/COMPLETE_ALL_TODOS',
  CLEAR_COMPLETED_TODOS: 'todos/CLEAR_COMPLETED_TODOS',
}

export const actionCreators = {
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

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.TODOS_LOADED: {
      return action.payload
    }
    case actionTypes.ADD_TODO: {
      return [...state, action.payload]
    }
    case actionTypes.DELETE_TODO: {
      return state.filter((todo) => todo.id !== action.payload.id)
    }
    case actionTypes.TOGGLE_TODO: {
      return state.map((todo) => {
        if (todo.id !== action.payload) {
          return todo
        }

        return {
          ...todo,
          completed: !todo.completed,
        }
      })
    }
    case actionTypes.CHANGE_TODO_COLOR: {
      return state.map((todo) => {
        if (todo.id !== action.payload.id) {
          return todo
        }

        return {
          ...todo,
          color: action.payload.color,
        }
      })
    }
    case actionTypes.COMPLETE_ALL_TODOS: {
      return state.map((todo) => {
        if (todo.completed) {
          return todo
        }

        return {
          ...todo,
          completed: true,
        }
      })
    }
    case actionTypes.CLEAR_COMPLETED_TODOS: {
      return state.filter((todo) => !todo.completed)
    }
    default:
      return state
  }
}

export function fetchTodos() {
  return async function fetchTodosThunk(dispatch, _) {
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
