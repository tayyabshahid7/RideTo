import { requestToken, removeToken } from 'services/auth'
import { saveState, clearState } from 'services/localStorage'
import { getPendingOrders } from 'store/dashboard'
import { getSchoolOrders } from 'store/orders'
import { getInstructors } from 'store/instructor'
import { LOGOUT, RESET } from './common'

const CHANGE_SCHOOL = 'rideto/auth/CHANGE_SCHOOL'
const LOGIN_REQUEST = 'rideto/auth/LOGIN_REQUEST'
const LOGIN_ERROR = 'rideto/auth/LOGIN_ERROR'
const LOGIN_SUCCESS = 'rideto/auth/LOGIN_SUCCESS'
// const LOGOUT = 'rideto/auth/LOGOUT'
// const RESET = 'rideto/auth/RESET'

const loginRequest = () => ({ type: LOGIN_REQUEST })
const loginError = error => ({ type: LOGIN_ERROR, error })
const loginSuccess = data => ({ type: LOGIN_SUCCESS, data })

const changeSchoolRequest = school => ({ type: CHANGE_SCHOOL, school })

export const changeSchool = (schoolId, schoolName) => {
  return async dispatch => {
    dispatch(getPendingOrders(schoolId))
    dispatch(getSchoolOrders(schoolId))
    dispatch(changeSchoolRequest({ id: schoolId, name: schoolName }))
    dispatch(getInstructors(schoolId))
  }
}

export const reset = () => ({ type: RESET })

export const login = (email, password) => {
  return async dispatch => {
    dispatch(loginRequest())
    try {
      const response = await requestToken(email, password)

      if (response.status === 200) {
        saveState({ auth: { user: response.user } })
        dispatch(loginSuccess(response))
      }
    } catch (error) {
      let errorMessage = 'Unexpected error'
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.status)
        if (error.response.status === 400) {
          errorMessage = 'Invalid username or password.'
        } else {
          errorMessage = error.message
        }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
        errorMessage = 'Please check your network connection.'
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error)
        errorMessage = error.message
      }
      dispatch(loginError(errorMessage))
    }
  }
}

export const logout = () => ({ type: LOGOUT })

const initialState = {
  loading: false,
  loggedIn: false,
  schoolId: null,
  schoolName: null,
  error: null,
  user: null
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_SCHOOL:
      return {
        ...state,
        schoolId: action.school.id,
        schoolName: action.school.name
      }

    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true
      }
    case LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        loggedIn: false,
        error: action.error
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loggedIn: true,
        error: null,
        schoolId: action.data.user.suppliers[0].id,
        schoolName: action.data.user.suppliers[0].name,
        user: action.data.user
      }
    case LOGOUT:
      clearState()
      removeToken()
      return { ...initialState }
    case RESET:
      removeToken()
      return { ...initialState }
    default:
      return state
  }
}
