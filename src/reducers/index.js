import { combineReducers } from 'redux'
import { dashboard } from './dashboard'
import { orders } from './orders'
import { auth } from './auth'
import { course } from './course'
import { info } from './info'

const appReducer = combineReducers({
  auth,
  dashboard,
  info,
  course,
  orders
})
export default appReducer
