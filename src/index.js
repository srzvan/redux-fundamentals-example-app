import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import App from './App'
import store from './store'

import './api/server'

store.dispatch({ type: 'todos/ADD_TODO', payload: 'Learn about actions' })

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
