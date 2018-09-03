import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { loadState } from 'services/localStorage'
import './index.scss'
import App from './App'
import configureStore from './store'

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
