import {
  fetchSingleCourse,
  fetchCourses,
  deleteSingleCourse,
  addSchoolOrder,
  updateSchoolCourse
} from 'services/course'
import { CALENDAR_VIEW } from 'common/constants'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

const FETCH_ALL = createRequestTypes('rideto/course/FETCH/ALL')
const UPDATE_CALENDAR_SETTING = 'rideto/course/UPDATE/CALENDAR_SETTING'
const FETCH_FOR_DAY = createRequestTypes('rideto/course/FETCH/DAY')
const FETCH_SINGLE = createRequestTypes('rideto/course/FETCH/SINGLE')
const DELETE = createRequestTypes('rideto/course/DELETE')
const UPDATE = createRequestTypes('rideto/course/UPDATE')
const CREATE_ORDER = createRequestTypes('rideto/course/CREATE/ORDER')

export const getSingleCourse = ({
  schoolId,
  courseId,
  reset = false
}) => async dispatch => {
  dispatch({ type: FETCH_SINGLE[REQUEST], reset })

  try {
    const course = await fetchSingleCourse(schoolId, courseId)
    dispatch({
      type: FETCH_SINGLE[SUCCESS],
      data: {
        course
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_SINGLE[FAILURE], error })
  }
}

export const getDayCourses = ({ schoolId, date }) => async dispatch => {
  dispatch({ type: FETCH_FOR_DAY[REQUEST], date })

  try {
    const courses = await fetchCourses(schoolId, date, date)

    dispatch({
      type: FETCH_FOR_DAY[SUCCESS],
      data: {
        courses
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_FOR_DAY[FAILURE], error })
  }
}

export const deleteCourse = ({ schoolId, courseId }) => async dispatch => {
  dispatch({ type: DELETE[REQUEST] })

  try {
    await deleteSingleCourse(schoolId, courseId)
    dispatch({
      type: DELETE[SUCCESS],
      data: {
        courseId
      }
    })
  } catch (error) {
    dispatch({ type: DELETE[FAILURE], error })
  }
}

export const getCourses = ({
  schoolId,
  firstDate,
  lastDate
}) => async dispatch => {
  dispatch({ type: FETCH_ALL[REQUEST] })

  try {
    const courses = await fetchCourses(schoolId, firstDate, lastDate)
    dispatch({
      type: FETCH_ALL[SUCCESS],
      data: {
        courses
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_ALL[FAILURE], error })
  }
}

export const updateCalendarSetting = data => async dispatch => {
  dispatch({ type: UPDATE_CALENDAR_SETTING, data })
}

export const createSchoolOrder = ({ schoolId, order }) => async dispatch => {
  dispatch({ type: CREATE_ORDER[REQUEST] })

  try {
    let response = await addSchoolOrder(schoolId, order)
    dispatch({
      type: CREATE_ORDER[SUCCESS],
      data: {
        course: response
      }
    })
    dispatch(
      getSingleCourse({
        schoolId,
        courseId: order.school_course_id,
        reset: false
      })
    )
  } catch (error) {
    dispatch({ type: CREATE_ORDER[FAILURE], error })
    return false
  }
  return true
}

export const updateCourse = ({
  schoolId,
  courseId,
  data
}) => async dispatch => {
  dispatch({ type: UPDATE[REQUEST] })
  try {
    let response = await updateSchoolCourse(schoolId, courseId, data)
    dispatch({
      type: UPDATE[SUCCESS],
      data: { course: response }
    })
  } catch (error) {
    dispatch({ type: UPDATE[FAILURE], error })
  }
}

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

export default function reducer(state = initialState, action) {
  let dayCourses
  let calendarCourses
  switch (action.type) {
    case FETCH_SINGLE[REQUEST]:
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
    case FETCH_SINGLE[SUCCESS]:
      dayCourses = state.day.courses.map(
        course =>
          course.id !== action.data.course.id
            ? course
            : { ...action.data.course }
      )
      calendarCourses = state.calendar.courses.map(
        course =>
          course.id !== action.data.course.id
            ? course
            : { ...action.data.course }
      )
      return {
        ...state,
        single: { loading: false, course: action.data.course, error: null },
        day: { ...state.day, courses: dayCourses },
        calendar: { ...state.calendar, courses: calendarCourses }
      }
    case FETCH_SINGLE[FAILURE]:
      return {
        ...state,
        single: { loading: false, course: null, error: action.error }
      }
    case DELETE[REQUEST]:
      return {
        ...state,
        single: { loading: true }
      }
    case DELETE[SUCCESS]:
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
    case FETCH_FOR_DAY[REQUEST]:
      return {
        ...state,
        day: {
          courses: [],
          date: action.date,
          loading: true
        }
      }
    case FETCH_FOR_DAY[SUCCESS]:
      return {
        ...state,
        day: {
          ...state.day,
          loading: false,
          courses: [...action.data.courses],
          error: null
        }
      }
    case FETCH_FOR_DAY[FAILURE]:
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
    case FETCH_ALL[REQUEST]:
      return {
        ...state,
        calendar: {
          ...state.calendar,
          loading: true
        }
      }
    case FETCH_ALL[SUCCESS]:
      return {
        ...state,
        calendar: {
          ...state.calendar,
          loading: false,
          courses: [...action.data.courses],
          error: null
        }
      }
    case FETCH_ALL[FAILURE]:
      return {
        ...state,
        calendar: {
          ...state.calendar,
          loading: false,
          error: action.error
        }
      }
    case CREATE_ORDER[REQUEST]:
      return {
        ...state,
        single: { ...state.single, saving: true, error: null }
      }
    case CREATE_ORDER[SUCCESS]:
      return {
        ...state,
        single: { ...state.single, saving: false }
      }
    case CREATE_ORDER[FAILURE]:
      return {
        ...state,
        single: { ...state.single, saving: false, error: action.error }
      }
    case UPDATE[REQUEST]:
      return {
        ...state,
        single: { ...state.single, saving: true, error: null }
      }
    case UPDATE[SUCCESS]:
      dayCourses = state.day.courses.map(
        course =>
          course.id !== action.data.course.id
            ? course
            : { ...action.data.course }
      )
      calendarCourses = state.calendar.courses.map(
        course =>
          course.id !== action.data.course.id
            ? course
            : { ...action.data.course }
      )
      return {
        ...state,
        single: { saving: false, course: action.data.course, error: null },
        day: { ...state.day, courses: dayCourses },
        calendar: { ...state.calendar, courses: calendarCourses }
      }
    case UPDATE[FAILURE]:
      return {
        ...state,
        single: { ...state.single, saving: false, error: action.error }
      }
    default:
      return state
  }
}
