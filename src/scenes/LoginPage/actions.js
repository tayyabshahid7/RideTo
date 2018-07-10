import { apiRequestLogin } from 'services/api'
import * as types from './types'

const loginRequest = () => ({ type: types.LOGIN_REQUEST })
const loginError = (error) => ({ type: types.LOGIN_ERROR, error })
const loginSuccess = (data) => ({ type: types.LOGIN_SUCCESS, data })
const reset = () => ({ type: types.RESET })

export const login = (email, password) => {
  return async (dispatch) => {
    dispatch(loginRequest())
    try {
      const response = await apiRequestLogin(email, password)
      if(response.status === 200)
        dispatch(loginSuccess(response.data))
      else
        throw "Invalid credentials."
    } catch (error) {
      dispatch(loginError(error))
    }
  }
}

