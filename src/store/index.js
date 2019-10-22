import { combineReducers } from 'redux'
import dashboard from './dashboard'
import order from './order'
import auth from './auth'
import course from './course'
import event from './event'
import info from './info'
import instructor from './instructor'
import testCentre from './testCentre'
import customer from './customer'
import supplier from './supplier'
import settings from './settings'
import notification from './notification'
import upload from './upload'
import email from './email'
import sms from './sms'
import staff from './staff'
import user from './user'

const appReducer = combineReducers({
  auth,
  dashboard,
  info,
  course,
  event,
  instructor,
  testCentre,
  customer,
  order,
  settings,
  supplier,
  notification,
  upload,
  email,
  sms,
  staff,
  user
})
export default appReducer
