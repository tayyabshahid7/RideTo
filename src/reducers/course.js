import {
  SINGLE_COURSE_FETCH,
  DAY_COURSES_FETCH,
  UPDATE_CALENDAR_SETTING,
  COURSES_FETCH,
  DELETE_COURSE,
  CREATE_SCHOOL_ORDER,
  REQUEST,
  SUCCESS,
  FAILURE
} from '../actionTypes'
import { CALENDAR_VIEW } from '../common/constants'

const initialState = {
  single: {
    course: null,
    loading: false,
    saving: false,
    error: null
  },
  day: {
    courses: [],
    loading: false,
    date: null,
    error: null
  },
  calendar: {
    courses: [],
    loading: false,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    day: new Date().getDate(),
    error: null,
    viewMode: CALENDAR_VIEW.MONTH,
    rightPanelMode: null
  }
}

export const course = (state = initialState, action) => {
  let dayCourses
  let calendarCourses
  switch (action.type) {
    case SINGLE_COURSE_FETCH[REQUEST]:
      if (action.reset) {
        return {
          ...state,
          single: { loading: true, course: null, error: null }
        }
      }
      return {
        ...state,
        single: { ...state.single, loading: true }
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
    case DELETE_COURSE[REQUEST]:
      return {
        ...state,
        single: { loading: true }
      }
    case DELETE_COURSE[SUCCESS]:
      dayCourses = state.day.courses.filter(
        course => course.id !== action.data.courseId
      )
      calendarCourses = state.calendar.courses.filter(
        course => course.id !== action.data.courseId
      )
      return {
        ...state,
        single: { loading: false, course: null, error: null },
        day: { ...state.day, courses: dayCourses },
        calendar: { ...state.calendar, courses: calendarCourses }
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
    case UPDATE_CALENDAR_SETTING:
      return {
        ...state,
        calendar: {
          ...state.calendar,
          ...action.data
        }
      }
    case COURSES_FETCH[REQUEST]:
      return {
        ...state,
        calendar: {
          ...state.calendar,
          loading: true
        }
      }
    case COURSES_FETCH[SUCCESS]:
      return {
        ...state,
        calendar: {
          ...state.calendar,
          loading: false,
          courses: [...action.data.courses],
          error: null
        }
      }
    case COURSES_FETCH[FAILURE]:
      return {
        ...state,
        calendar: {
          ...state.calendar,
          loading: false,
          error: action.error
        }
      }
    case CREATE_SCHOOL_ORDER[REQUEST]:
      return {
        ...state,
        single: { ...state.single, saving: true }
      }
    case CREATE_SCHOOL_ORDER[SUCCESS]:
      return {
        ...state,
        single: { ...state.single, saving: true }
      }
    case CREATE_SCHOOL_ORDER[FAILURE]:
      return {
        ...state,
        single: { ...state.single, saving: true }
      }
    default:
      return state
  }
}
