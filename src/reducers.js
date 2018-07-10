import { combineReducers } from 'redux'
import { default as loginReducer } from 'scenes/LoginPage/reducer'
import { default as dashboardReducer } from 'scenes/Dashboard/reducer'
export default combineReducers({
  loginReducer,
  dashboardReducer,
})
