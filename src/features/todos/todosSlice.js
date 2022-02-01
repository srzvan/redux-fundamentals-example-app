const initialState = [
  { id: 0, text: 'Lean React', completed: true },
  { id: 1, text: 'Lean Redux', completed: false, color: 'purple' },
  { id: 2, text: 'Build something fun!', completed: true, color: 'blue' },
]

function nextTodoId(todos) {
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)

  return maxId + 1
}

export const actions = {
  ADD_TODO: 'todos/ADD_TODO',
  DELETE_TODO: 'todos/DELETE_TODO',
  TOGGLE_TODO: 'todos/TOGGLE_TODO',
  CHANGE_TODO_COLOR: 'todos/CHANGE_TODO_COLOR',
  COMPLETE_ALL_TODOS: 'todos/COMPLETE_ALL_TODOS',
  CLEAR_COMPLETED_TODOS: 'todos/CLEAR_COMPLETED_TODOS',
}

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case actions.ADD_TODO: {
      return [
        ...state,
        {
          id: nextTodoId(state),
          text: action.payload,
          completed: false,
        },
      ]
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
