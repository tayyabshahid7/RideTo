import SampleCalendar from '../json/sample-calendar.json'
import { apiGetSchoolOrders } from '../services/api'
import { COURSES_FETCH, REQUEST, SUCCESS, FAILURE } from '../actionTypes'

export const getCourses = filter => async dispatch => {
  dispatch({ type: COURSES_FETCH[REQUEST] })
  try {
    // const response = await apiGetSchoolOrders(schoolId, page, token);
    setTimeout(() => {
      dispatch({
        type: COURSES_FETCH[SUCCESS],
        data: {
          courses: SampleCalendar.results,
          month: new Date().getMonth(),
          year: new Date().getFullYear()
        }
      })
    }, 2000)
  } catch (error) {
    dispatch({ type: COURSES_FETCH[FAILURE], error })
  }
}
