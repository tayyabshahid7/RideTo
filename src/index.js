import React from 'react'
// import {render} from 'react-dom'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './index.scss'
import App from './App'
import throttle from 'lodash/throttle'
import configureStore from './store'
import { saveState, loadState } from './services/localStorage'
// import { removeToken } from 'services/auth'
// removeToken()

const persistedState = loadState()
const store = configureStore(persistedState)

store.subscribe(
  throttle(() => {
    saveState(store.getState())
  }, 1000)
)

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
