
import * as types from './types'

const initialState = {
  loading: false,
  loggedIn: false,
  schoolId: null,
  error: null,
  session: {
    user: null,
  },
}


export default (state = initialState, action) => {
  switch (action.type) {
    case types.CHANGE_SCHOOL:
      return {
        ...state,
        schoolId: action.schoolId,
      }

    case types.LOGIN_REQUEST:
      return { 
        ...state,
        loading: true,
      }
    case types.LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        loggedIn: false,
        error: action.error,
      }
    case types.LOGIN_SUCCESS:
      sessionStorage.setItem('token', action.data.token)
      return {
        ...state,
        loading: false,
        loggedIn: true,
        error: null,
        schoolId: action.data.user.suppliers[0].id,
        session: {
          user: action.data.user
        }
      }
    case types.LOGOUT:
      sessionStorage.removeItem('token')
      return {
        ...state,
        loggedIn: false,
         schoolId: null,
        error: null,
        session: null,
      }
    case types.RESET:
      sessionStorage.removeItem('token')
      return {...initialState}
    default:
      return state
  }
}
