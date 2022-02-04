import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import { client } from '../../api/client'
import { APICallStatusTypes, StatusFilters } from '../../utils'

const todosAdapter = createEntityAdapter()

const initialState = todosAdapter.getInitialState({
  status: APICallStatusTypes.IDLE,
})

// THUNKS

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await client.get('fakeApi/todos')

  return response.todos
})

export const saveTodo = createAsyncThunk('todos/saveTodo', async (text) => {
  const response = await client.post('/fakeApi/todos', { todo: { text } })

  return response.todo
})

// SLICE REDUCER

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoDeleted: todosAdapter.removeOne,
    todoToggled(state, action) {
      const id = action.payload
      const todo = state.entities[id]

      todosAdapter.updateOne(state, {
        id,
        changes: { completed: !todo.completed },
      })
    },
    todoColorChanged: {
      reducer(state, action) {
        const { id, color } = action.payload

        todosAdapter.updateOne(state, { id, changes: { color } })
      },
      prepare(id, color) {
        return {
          payload: { id, color },
        }
      },
    },
    allTodosCompleted(state, _) {
      const updates = Object.values(state.entities)
        .filter((todo) => !todo.completed)
        .map((todo) => ({
          id: todo.id,
          changes: {
            completed: true,
          },
        }))

      todosAdapter.updateMany(state, updates)
    },
    completedTodosCleared(state, _) {
      const completedIds = Object.values(state.entities).map(
        (todo) => todo.completed && todo.id
      )

      todosAdapter.removeMany(state, completedIds)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state, _) => {
        state.status = APICallStatusTypes.LOADING
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        todosAdapter.setAll(state, action.payload)
        state.status = APICallStatusTypes.IDLE
      })
      .addCase(saveTodo.fulfilled, todosAdapter.addOne)
  },
})

export const {
  todoDeleted,
  todoToggled,
  todoColorChanged,
  allTodosCompleted,
  completedTodosCleared,
} = todosSlice.actions

// SELECTORS

export default todosSlice.reducer

export const { selectAll: selectTodos, selectById: selectTodoById } =
  todosAdapter.getSelectors((state) => state.todos)

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
