import { combineReducers } from 'redux'
import dashboard from './dashboard'
import orders from './orders'
import auth from './auth'
import course from './course'
import info from './info'
import instructor from './instructor'

const appReducer = combineReducers({
  auth,
  dashboard,
  info,
  course,
  orders,
  instructor
})
export default appReducer
