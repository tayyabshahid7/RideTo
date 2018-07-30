import { fetchCourses } from 'services/course'
// import SampleCalendar from '../json/sample-calendar.json'
import {
  COURSES_FETCH,
  REQUEST,
  SUCCESS,
  FAILURE,
  UPDATE_CALENDAR_SETTING
} from '../actionTypes'

export const getCourses = ({
  schoolId,
  firstDate,
  lastDate
}) => async dispatch => {
  dispatch({ type: COURSES_FETCH[REQUEST] })

  try {
    const courses = await fetchCourses(schoolId, firstDate, lastDate)

    setTimeout(() => {
      dispatch({
        type: COURSES_FETCH[SUCCESS],
        data: {
          courses
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
