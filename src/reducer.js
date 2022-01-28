import { combineReduces } from 'redux'

import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'

const rootReducer = combineReduces({
  todos: todosReducer,
  filters: filtersReducer,
})

export default rootReducer
