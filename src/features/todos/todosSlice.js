import { client } from '../../api/client'

const initialState = []

export const actions = {
  ADD_TODO: 'todos/ADD_TODO',
  DELETE_TODO: 'todos/DELETE_TODO',
  TOGGLE_TODO: 'todos/TOGGLE_TODO',
  TODOS_LOADED: 'todos/TODOS_LOADED',
  CHANGE_TODO_COLOR: 'todos/CHANGE_TODO_COLOR',
  COMPLETE_ALL_TODOS: 'todos/COMPLETE_ALL_TODOS',
  CLEAR_COMPLETED_TODOS: 'todos/CLEAR_COMPLETED_TODOS',
}

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case actions.TODOS_LOADED: {
      return action.payload
    }
    case actions.ADD_TODO: {
      return [...state, action.payload]
    }
    case actions.DELETE_TODO: {
      return state.filter((todo) => todo.id !== action.payload.id)
    }
    case actions.TOGGLE_TODO: {
      return state.map((todo) => {
        if (todo.id !== action.payload.id) {
          return todo
        }

        return {
          ...todo,
          completed: !todo.completed,
        }
      })
    }
    case actions.CHANGE_TODO_COLOR: {
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
    case actions.COMPLETE_ALL_TODOS: {
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
    case actions.CLEAR_COMPLETED_TODOS: {
      return state.filter((todo) => !todo.completed)
    }
    default:
      return state
  }
}

export async function fetchTodos(dispatch, _) {
  const response = await client.get('/fakeApi/todos')

  dispatch({ type: actions.TODOS_LOADED, payload: response.todos })
}

export function saveTodo(text) {
  return async function saveTodoThunk(dispatch, _) {
    const response = await client.post('/fakeApi/todos', { todo: { text } })

    dispatch({ type: actions.ADD_TODO, payload: response.todo })
  }
}
