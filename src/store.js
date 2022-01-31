import { createStore } from 'redux'

import rootReducer from './reducer'

let preloadedState = loadLocalStorageState()
const store = createStore(rootReducer, preloadedState)

function loadLocalStorageState() {
  const persistedTodosString = localStorage.getItem('todos')

  if (persistedTodosString) {
    return {
      todos: JSON.parse(persistedTodosString),
    }
  }
}

export default store
