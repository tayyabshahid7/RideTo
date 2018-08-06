import {
  fetchSingleCourse,
  fetchCourses,
  deleteSingleCourse
} from 'services/course'
import {
  DAY_COURSES_FETCH,
  SINGLE_COURSE_FETCH,
  DELETE_COURSE,
  COURSES_FETCH,
  UPDATE_CALENDAR_SETTING,
  REQUEST,
  SUCCESS,
  FAILURE
} from '../actionTypes'

export const getSingleCourse = ({ schoolId, courseId }) => async dispatch => {
  dispatch({ type: SINGLE_COURSE_FETCH[REQUEST] })

  try {
    const course = await fetchSingleCourse(schoolId, courseId)
    dispatch({
      type: SINGLE_COURSE_FETCH[SUCCESS],
      data: {
        course
      }
    })
  } catch (error) {
    dispatch({ type: SINGLE_COURSE_FETCH[FAILURE], error })
  }
}

export const getDayCourses = ({ schoolId, date }) => async dispatch => {
  dispatch({ type: DAY_COURSES_FETCH[REQUEST], date })

  try {
    const courses = await fetchCourses(schoolId, date, date)

    dispatch({
      type: DAY_COURSES_FETCH[SUCCESS],
      data: {
        courses
      }
    })
  } catch (error) {
    dispatch({ type: DAY_COURSES_FETCH[FAILURE], error })
  }
}

export const deleteCourse = ({ schoolId, courseId }) => async dispatch => {
  dispatch({ type: DELETE_COURSE[REQUEST] })

  try {
    await deleteSingleCourse(schoolId, courseId)
    dispatch({
      type: DELETE_COURSE[SUCCESS],
      data: {
        courseId
      }
    })
  } catch (error) {
    dispatch({ type: DELETE_COURSE[FAILURE], error })
  }
}

export const getCourses = ({
  schoolId,
  firstDate,
  lastDate
}) => async dispatch => {
  dispatch({ type: COURSES_FETCH[REQUEST] })

  try {
    const courses = await fetchCourses(schoolId, firstDate, lastDate)
    dispatch({
      type: COURSES_FETCH[SUCCESS],
      data: {
        courses
      }
    })
  } catch (error) {
    dispatch({ type: COURSES_FETCH[FAILURE], error })
  }
}

export const updateCalendarSetting = data => async dispatch => {
  dispatch({ type: UPDATE_CALENDAR_SETTING, data })
}
