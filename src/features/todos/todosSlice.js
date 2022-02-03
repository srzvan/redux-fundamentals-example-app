import { createSelector, createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { client } from '../../api/client'
import { APICallStatusTypes, StatusFilters } from '../../utils'

const initialState = {
  status: APICallStatusTypes.IDLE,
  entities: {},
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

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await client.get('fakeApi/todos')

  return response.todos
})

export const saveTodo = createAsyncThunk('todos/saveTodo', async (text) => {
  const response = await client.post('/fakeApi/todos', { todo: { text } })

  return response.todo
})

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
      Object.values(state.entities).forEach((todo) => {
        if (todo.completed) {
          delete state.entities[todo.id]
        }
      })
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state, _) => {
        state.status = APICallStatusTypes.LOADING
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        const newEntities = {}

        action.payload.forEach((todo) => {
          newEntities[todo.id] = todo
        })

        state.entities = newEntities
        state.status = APICallStatusTypes.IDLE
      })
      .addCase(saveTodo.fulfilled, (state, action) => {
        const todo = action.payload

        state.entities[todo.id] = todo
      })
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
