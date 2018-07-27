import { COURSES_FETCH, REQUEST, SUCCESS, FAILURE } from '../actionTypes'
import { CALENDAR_VIEW } from '../common/constants'

const initialState = {
  courses: [],
  loading: false,
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  error: null,
  viewMode: CALENDAR_VIEW.MONTH,
  rightPanelMode: null
}

export const calendar = (state = initialState, action) => {
  switch (action.type) {
    case COURSES_FETCH[REQUEST]:
      return {
        ...state,
        loading: true
      }
    case COURSES_FETCH[SUCCESS]:
      return {
        ...state,
        loading: false,
        courses: [...action.data.courses],
        month: action.data.month,
        year: action.data.year,
        error: null
      }
    case COURSES_FETCH[FAILURE]:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return state
  }
}
