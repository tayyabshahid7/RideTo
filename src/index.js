import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import App from 'App'
import './index.scss'
import throttle from 'lodash/throttle'
import {configureStore} from 'store'
import { saveState, loadState } from './services/localStorage'

const persistedState = loadState()
const store = configureStore(persistedState)

store.subscribe(throttle(() => {
  saveState(store.getState())
},1000))

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
