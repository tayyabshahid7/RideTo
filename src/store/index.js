import { combineReducers } from 'redux'
import dashboard from './dashboard'
import orders from './orders'
import auth from './auth'
import course from './course'
import event from './event'
import info from './info'
import instructor from './instructor'

const appReducer = combineReducers({
  auth,
  dashboard,
  info,
  course,
  event,
  orders,
  instructor
})
export default appReducer
