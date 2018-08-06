import { combineReducers } from 'redux'
import { dashboard } from './dashboard'
import { orders } from './orders'
import { auth } from './auth'
// import { calendar } from './calendar'
import { course } from './course'

const appReducer = combineReducers({
  auth,
  dashboard,
  // calendar,
  course,
  orders
})
export default appReducer
