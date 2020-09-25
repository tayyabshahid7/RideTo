import {
  fetchTestCentres,
  fetchDefaultTestCentres,
  updateDefaultTestCentres
} from 'services/testCentre'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

const FETCH_ALL = createRequestTypes('rideto/testCentres/FETCH/ALL')
const FETCH_DEFAULT = createRequestTypes('rideto/testCentres/FETCH/DEFAULT')
const UPDATE_DEFAULT = createRequestTypes('rideto/testCentres/UPDATE/DEFAULT')

export const getTestCentres = () => async dispatch => {
  dispatch({ type: FETCH_ALL[REQUEST] })

  try {
    const testCentres = await fetchTestCentres()
    dispatch({
      type: FETCH_ALL[SUCCESS],
      data: {
        testCentres
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_ALL[FAILURE], error })
  }
}

export const getDefaultTestCentres = () => async dispatch => {
  dispatch({ type: FETCH_DEFAULT[REQUEST] })

  try {
    const defaultTestCentres = await fetchDefaultTestCentres()
    dispatch({
      type: FETCH_DEFAULT[SUCCESS],
      data: {
        defaultTestCentres
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_DEFAULT[FAILURE], error })
  }
}

export const setDefaultTestCentres = data => async dispatch => {
  dispatch({ type: UPDATE_DEFAULT[REQUEST] })

  try {
    await updateDefaultTestCentres(data)
    dispatch({
      type: UPDATE_DEFAULT[SUCCESS],
      data: {
        defaultTestCentres: data
      }
    })
  } catch (error) {
    dispatch({ type: UPDATE_DEFAULT[FAILURE], error })
  }
}

const initialState = {
  testCentres: [],
  defaultTestCentres: [],
  saving: false,
  loading: false,
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
        testCentres: [...action.data.testCentres]
      }
    case FETCH_ALL[FAILURE]:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case FETCH_DEFAULT[REQUEST]:
      return {
        ...state,
        loading: true
      }
    case FETCH_DEFAULT[SUCCESS]:
      return {
        ...state,
        loading: false,
        defaultTestCentres: [...action.data.defaultTestCentres]
      }
    case FETCH_DEFAULT[FAILURE]:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case UPDATE_DEFAULT[REQUEST]:
      return {
        ...state,
        saving: true
      }
    case UPDATE_DEFAULT[SUCCESS]:
      return {
        ...state,
        saving: false,
        defaultTestCentres: [...action.data.defaultTestCentres]
      }
    case UPDATE_DEFAULT[FAILURE]:
      return {
        ...state,
        saving: false,
        error: action.error
      }
    default:
      return state
  }
}
