import {
  COURSES_FETCH,
  REQUEST,
  SUCCESS,
  FAILURE,
  UPDATE_CALENDAR_SETTING
} from '../actionTypes'
import { CALENDAR_VIEW } from '../common/constants'

const initialState = {
  courses: [],
  loading: false,
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  day: new Date().getDate(),
  error: null,
  viewMode: CALENDAR_VIEW.MONTH,
  rightPanelMode: null
}

export const calendar = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CALENDAR_SETTING:
      return {
        ...state,
        ...action.data
      }
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
