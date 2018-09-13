import { combineReducers } from 'redux'
import dashboard from './dashboard'
import order from './order'
import auth from './auth'
import course from './course'
import event from './event'
import info from './info'
import instructor from './instructor'
import customer from './customer'
import supplier from './supplier'
import settings from './settings'
import notification from './notification'

const appReducer = combineReducers({
  auth,
  dashboard,
  info,
  course,
  event,
  instructor,
  customer,
  order,
  settings,
  supplier,
  notification
})
export default appReducer
