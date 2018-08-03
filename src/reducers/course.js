import {
  SINGLE_COURSE_FETCH,
  DAY_COURSES_FETCH,
  REQUEST,
  SUCCESS,
  FAILURE
} from '../actionTypes'

const initialState = {
  single: {
    course: null,
    loading: false,
    error: null
  },
  day: {
    courses: [],
    loading: false,
    date: null,
    error: null
  }
}

export const course = (state = initialState, action) => {
  switch (action.type) {
    case SINGLE_COURSE_FETCH[REQUEST]:
      return {
        ...state,
        single: { loading: true, course: null, error: null }
      }
    case SINGLE_COURSE_FETCH[SUCCESS]:
      return {
        ...state,
        single: { loading: false, course: action.data.course, error: null }
      }
    case SINGLE_COURSE_FETCH[FAILURE]:
      return {
        ...state,
        single: { loading: false, course: null, error: action.error }
      }
    case DAY_COURSES_FETCH[REQUEST]:
      return {
        ...state,
        day: {
          courses: [],
          date: action.date,
          loading: true
        }
      }
    case DAY_COURSES_FETCH[SUCCESS]:
      return {
        ...state,
        day: {
          ...state.day,
          loading: false,
          courses: [...action.data.courses],
          error: null
        }
      }
    case DAY_COURSES_FETCH[FAILURE]:
      return {
        ...state,
        day: {
          ...state.day,
          loading: false,
          error: action.error
        }
      }
    default:
      return state
  }
}
