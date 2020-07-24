import {
  requestToken,
  removeToken,
  updatePassword as updatePasswordApi
} from 'services/auth'
import { saveState, clearState } from 'services/localStorage'
import { getPendingOrders } from 'store/dashboard'
import { getInstructors } from 'store/instructor'
import {
  LOGOUT,
  RESET,
  REQUEST,
  SUCCESS,
  FAILURE,
  createRequestTypes
} from './common'

const CHANGE_SCHOOL = 'rideto/auth/CHANGE_SCHOOL'
const UPDATE_ACTIVE_SCHOOLS = 'rideto/auth/UPDATE_ACTIVE_SCHOOLS'
const LOGIN_REQUEST = 'rideto/auth/LOGIN_REQUEST'
const LOGIN_ERROR = 'rideto/auth/LOGIN_ERROR'
const LOGIN_SUCCESS = 'rideto/auth/LOGIN_SUCCESS'
const UPDATE_PASSWORD = createRequestTypes('UPDATE_PASSWORD')
// const LOGOUT = 'rideto/auth/LOGOUT'
// const RESET = 'rideto/auth/RESET'

const loginRequest = () => ({ type: LOGIN_REQUEST })
const loginError = error => ({ type: LOGIN_ERROR, error })
const loginSuccess = data => ({ type: LOGIN_SUCCESS, data })

const changeSchoolRequest = school => ({ type: CHANGE_SCHOOL, school })
const updateActiveSchoolRequest = schoolIds => ({
  type: UPDATE_ACTIVE_SCHOOLS,
  schoolIds
})

const persistAuthState = (state, newState) => {
  const auth = {
    user: state.user,
    schoolId: state.schoolId,
    activeSchools: state.activeSchools,
    ...newState
  }
  saveState({ auth })
}

export const changeSchool = (schoolId, schoolName) => {
  return async dispatch => {
    dispatch(getPendingOrders(schoolId))
    dispatch(changeSchoolRequest({ id: schoolId, name: schoolName }))
    dispatch(getInstructors(schoolId))
  }
}

export const updateActiveSchool = schoolIds => {
  return async dispatch => {
    dispatch(updateActiveSchoolRequest(schoolIds))
  }
}

export const reset = () => ({ type: RESET })

export const login = (email, password) => {
  return async dispatch => {
    dispatch(loginRequest())
    try {
      const response = await requestToken(email, password)
      dispatch(loginSuccess(response))
    } catch (error) {
      let errorMessage = 'Unexpected error'
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 400) {
          errorMessage = 'Invalid username or password.'
        } else {
          errorMessage = error.message
        }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
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

export const updatePassword = data => async dispatch => {
  dispatch({ type: UPDATE_PASSWORD[REQUEST] })
  try {
    await updatePasswordApi(data)
    dispatch({
      type: UPDATE_PASSWORD[SUCCESS]
    })
  } catch (error) {
    dispatch({ type: UPDATE_PASSWORD[FAILURE], error })
  }
}

const initialState = {
  loading: false,
  loggedIn: false,
  schoolId: null,
  schoolName: null,
  activeSchools: [],
  error: null,
  user: null,
  saving: false
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_SCHOOL:
      persistAuthState(state, {
        schoolId: action.school.id
      })
      return {
        ...state,
        schoolId: action.school.id,
        schoolName: action.school.name
      }

    case UPDATE_ACTIVE_SCHOOLS:
      persistAuthState(state, {
        activeSchools: action.schoolIds
      })
      return {
        ...state,
        activeSchools: action.schoolIds
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
      clearState('auth')
      persistAuthState(state, {
        user: action.data.user,
        schoolId: action.data.user.suppliers[0].id
      })
      return {
        ...state,
        loading: false,
        loggedIn: true,
        error: null,
        schoolId: action.data.user.suppliers[0].id,
        schoolName: action.data.user.suppliers[0].name,
        activeSchools: [],
        user: action.data.user
      }
    case UPDATE_PASSWORD[REQUEST]:
      return {
        ...state,
        saving: true,
        error: null
      }
    case UPDATE_PASSWORD[SUCCESS]:
      return {
        ...state,
        saving: false
      }
    case UPDATE_PASSWORD[FAILURE]:
      return {
        ...state,
        saving: false,
        error: action.error
      }
    case LOGOUT:
      clearState('auth')
      removeToken()
      return { ...initialState }
    case RESET:
      removeToken()
      return { ...initialState }
    default:
      return state
  }
}
