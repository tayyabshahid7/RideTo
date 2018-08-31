import { combineReducers } from 'redux'
import dashboard from './dashboard'
import orders from './orders'
import auth from './auth'
import course from './course'
import event from './event'
import info from './info'
import instructor from './instructor'
import customer from './customer'

const appReducer = combineReducers({
  auth,
  dashboard,
  info,
  course,
  event,
  orders,
  instructor,
  customer
})
export default appReducer
