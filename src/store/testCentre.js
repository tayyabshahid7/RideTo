import { fetchTestCentres } from 'services/testCentre'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

const FETCH_ALL = createRequestTypes('rideto/testCentres/FETCH/ALL')

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

const initialState = {
  testCentres: [],
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
    default:
      return state
  }
}
