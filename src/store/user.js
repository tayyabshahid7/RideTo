import {
  fetchUsers,
  addUser,
  updateUser,
  removeUser
} from 'services/staff-user'
import { actions as notificationActions } from './notification'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

const module = 'rideto/user'
const FETCH_ALL = createRequestTypes(`${module}/FETCH/ALL`)
const SAVE = createRequestTypes(`${module}/SAVE`)
const UPDATE = createRequestTypes(`${module}/UPDATE`)
const DELETE = createRequestTypes(`${module}/DELETE`)

export const getUsers = schoolId => async dispatch => {
  dispatch({ type: FETCH_ALL[REQUEST] })

  try {
    const users = await fetchUsers(schoolId)
    dispatch({
      type: FETCH_ALL[SUCCESS],
      data: {
        users
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_ALL[FAILURE], error })
  }
}

export const newUser = (schoolId, data) => async dispatch => {
  dispatch({ type: SAVE[REQUEST] })

  try {
    const user = await addUser(schoolId, data)
    dispatch({
      type: SAVE[SUCCESS],
      data: { user }
    })
    notificationActions.dispatchSuccess(dispatch, 'User added.')
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Could not add user.')
    dispatch({ type: SAVE[FAILURE], error })
  }
}

export const editUser = (schoolId, data) => async dispatch => {
  dispatch({ type: UPDATE[REQUEST] })
  try {
    const user = await updateUser(schoolId, data)
    dispatch({
      type: UPDATE[SUCCESS],
      data: { user }
    })
    notificationActions.dispatchSuccess(dispatch, 'User edited.')
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Could not edit user.')
    dispatch({ type: UPDATE[FAILURE], error })
  }
}

export const deleteUser = (schoolId, userId) => async dispatch => {
  dispatch({ type: DELETE[REQUEST] })

  try {
    const result = await removeUser(schoolId, userId)
    dispatch({
      type: DELETE[SUCCESS],
      data: {
        ...result,
        user: userId
      }
    })
    notificationActions.dispatchSuccess(dispatch, 'User deleted.')
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Could not delete User.')
    dispatch({ type: DELETE[FAILURE], error })
  }
}

const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  saving: false,
  error: null
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ALL[REQUEST]:
      return {
        ...state,
        loading: true
      }
    case FETCH_ALL[SUCCESS]:
      return {
        ...state,
        loading: false,
        users: [...action.data.users]
      }
    case FETCH_ALL[FAILURE]:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case SAVE[REQUEST]:
      return {
        ...state,
        saving: true
      }
    case SAVE[SUCCESS]:
      return {
        ...state,
        saving: false,
        users: [...state.users, action.data.user],
        selectedUser: null
      }
    case SAVE[FAILURE]:
      return {
        ...state,
        saving: false,
        error: action.error
      }
    case UPDATE[REQUEST]:
      return {
        ...state,
        saving: true
      }
    case UPDATE[SUCCESS]:
      const updatedUser = action.data.user
      const updatedUsers = state.users.filter(
        user => user.id !== updatedUser.id
      )
      return {
        ...state,
        saving: false,
        users: [...updatedUsers, updatedUser],
        selectedUser: null
      }
    case UPDATE[FAILURE]:
      return {
        ...state,
        saving: false,
        error: action.error
      }
    case DELETE[REQUEST]:
      return {
        ...state,
        saving: true
      }
    case DELETE[SUCCESS]:
      const deletedId = action.data.user
      const newUsers = state.users.filter(user => user.user !== deletedId)
      return {
        ...state,
        users: [...newUsers],
        saving: false,
        selectedUser: null
      }
    case DELETE[FAILURE]:
      return {
        ...state,
        saving: false,
        error: action.error
      }
    default:
      return state
  }
}
