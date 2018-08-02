import { combineReducers } from 'redux'
import { dashboard } from './dashboard'
import { orders } from './orders'
import { auth } from './auth'
import { calendar } from './calendar'
import { day } from './day'

const appReducer = combineReducers({
  auth,
  dashboard,
  calendar,
  day,
  orders
})
export default appReducer
