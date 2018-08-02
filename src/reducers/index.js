import { combineReducers } from 'redux'
import { dashboard } from './dashboard'
import { orders } from './orders'
import { auth } from './auth'
import { calendar } from './calendar'

const appReducer = combineReducers({
  auth,
  dashboard,
  calendar,
  orders
})
export default appReducer
