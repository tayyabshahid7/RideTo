import SampleCalendar from '../json/sample-calendar.json'
import { apiGetSchoolOrders } from '../services/api'
import { COURSES_FETCH, REQUEST, SUCCESS, FAILURE } from '../actionTypes'
import { fetchCourses } from 'services/course'

export const getCourses = filter => async dispatch => {
  dispatch({ type: COURSES_FETCH[REQUEST] })

  try {
    const courses = await fetchCourses(697, '2018-01-01', '2018-09-01')

    setTimeout(() => {
      dispatch({
        type: COURSES_FETCH[SUCCESS],
        data: {
          courses,
          month: new Date().getMonth(),
          year: new Date().getFullYear()
        }
      })
    }, 2000)
  } catch (error) {
    dispatch({ type: COURSES_FETCH[FAILURE], error })
  }
}
