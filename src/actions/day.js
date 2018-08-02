import { fetchDayCourses } from 'services/course'
import { DAY_COURSES_FETCH, REQUEST, SUCCESS, FAILURE } from '../actionTypes'

export const getDayCourses = ({ schoolId, date }) => async dispatch => {
  dispatch({ type: DAY_COURSES_FETCH[REQUEST] })

  try {
    const courses = await fetchDayCourses(schoolId, date)

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
