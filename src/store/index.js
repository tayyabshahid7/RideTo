import { combineReducers } from 'redux'
import dashboard from './dashboard'
import orders from './orders'
import order from './order'
import auth from './auth'
import course from './course'
import info from './info'
import instructor from './instructor'
import customer from './customer'
import supplier from './supplier'

const appReducer = combineReducers({
  auth,
  dashboard,
  info,
  course,
  orders,
  instructor,
  customer,
  order,
  supplier
})
export default appReducer
