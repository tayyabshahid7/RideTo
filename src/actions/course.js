import { fetchSingleCourse, fetchCourses } from 'services/course'
import {
  DAY_COURSES_FETCH,
  SINGLE_COURSE_FETCH,
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
