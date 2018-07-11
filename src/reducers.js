import { combineReducers } from 'redux'
import { default as loginReducer } from 'scenes/Login/reducer'
import { default as dashboardReducer } from 'scenes/Dashboard/reducer'
export default combineReducers({
  loginReducer,
  dashboardReducer,
})
