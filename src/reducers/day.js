import { DAY_COURSES_FETCH, REQUEST, SUCCESS, FAILURE } from '../actionTypes'

const initialState = {
  courses: [],
  loading: false,
  date: null,
  error: null
}

export const day = (state = initialState, action) => {
  switch (action.type) {
    case DAY_COURSES_FETCH[REQUEST]:
      return {
        ...state,
        courses: [],
        date: action.date,
        loading: true
      }
    case DAY_COURSES_FETCH[SUCCESS]:
      return {
        ...state,
        loading: false,
        courses: [...action.data.courses],
        error: null
      }
    case DAY_COURSES_FETCH[FAILURE]:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return state
  }
}
