import { fetchInstructors } from 'services/instructor'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

const FETCH_ALL = createRequestTypes('rideto/instructor/FETCH/ALL')

export const getInstructors = schoolId => async dispatch => {
  dispatch({ type: FETCH_ALL[REQUEST] })

  try {
    const instructors = await fetchInstructors(schoolId)
    dispatch({
      type: FETCH_ALL[SUCCESS],
      data: {
        instructors
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_ALL[FAILURE], error })
  }
}

const initialState = {
  instructors: [],
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
        instructors: [...action.data.instructors]
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
