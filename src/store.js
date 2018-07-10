import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { default as rootReducer } from './reducers'

const enhancers = applyMiddleware(thunk, logger)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


export const configureStore = (preloadedState) => {
  return createStore(
    rootReducer, 
    preloadedState, 
    process.env.NODE_ENV !== 'production' ? composeEnhancers(enhancers) : enhancers
  )
}
