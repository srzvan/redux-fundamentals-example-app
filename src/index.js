import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import './api/server'
import App from './App'
import store from './store'
import { fetchTodos } from './features/todos/todosSlice'

import './index.css'

store.dispatch(fetchTodos)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
