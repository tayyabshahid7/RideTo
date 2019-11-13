import React from 'react'
import * as Sentry from '@sentry/browser'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { loadState } from 'services/localStorage'
import './index.scss'
import App from './App'
import configureStore from './store'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://5af978d41ecb4c2e97317c94021d4fbb@sentry.io/1398378'
  })
}

const store = configureStore(loadState())

const Component = () => (
  <Provider store={store}>
    <App />
  </Provider>
)
let render = () => {
  ReactDOM.render(<Component />, document.getElementById('root'))
}
render()

if (module.hot) {
  module.hot.accept(Component => {
    render()
  })
}
