import { RidingExperiences, PaymentStatus } from 'common/info'
import { getCourseTypes } from 'services/course'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

const GET_COURSE_TYPES = createRequestTypes('rideto/info/GET/COURSE_TYPES')

export const loadCourseTypes = () => async dispatch => {
  dispatch({ type: GET_COURSE_TYPES[REQUEST] })

  try {
    const courseTypes = await getCourseTypes()
    dispatch({
      type: GET_COURSE_TYPES[SUCCESS],
      data: courseTypes
    })
  } catch (error) {
    dispatch({ type: GET_COURSE_TYPES[FAILURE], error })
  }
}

const initialState = {
  ridingExperiences: RidingExperiences,
  paymentStatus: PaymentStatus,
  courseTypes: []
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_COURSE_TYPES[SUCCESS]:
      return { ...state, courseTypes: action.data }
    default:
      return state
  }
}
