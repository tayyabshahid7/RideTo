import SampleCalendar from '../json/sample-calendar.json'
import { apiGetSchoolOrders } from '../services/api'
import { fetchCourses } from 'services/course'
import {
  COURSES_FETCH,
  REQUEST,
  SUCCESS,
  FAILURE,
  UPDATE_CALENDAR_SETTING
} from '../actionTypes'

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

export const updateCalendarSetting = data => async dispatch => {
  dispatch({ type: UPDATE_CALENDAR_SETTING, data })
}
