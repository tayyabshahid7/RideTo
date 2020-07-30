import { RidingExperiences } from 'common/info'
import { getCourseTypes } from 'services/course'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

const GET_COURSE_TYPES = createRequestTypes('rideto/info/GET/COURSE_TYPES')
const GET_ALL_COURSE_TYPES = createRequestTypes(
  'rideto/info/GET/ALL_COURSE_TYPES'
)

export const getAllCourseTypes = schoolIds => async dispatch => {
  dispatch({ type: GET_ALL_COURSE_TYPES[REQUEST] })

  try {
    const requests = schoolIds.map(schoolId => getCourseTypes(schoolId))
    const result = await Promise.all(requests)
    const courseTypes = []
    result.forEach((types, index) => {
      types.forEach(type => {
        const tmp = courseTypes.find(x => x.id === type.id)
        if (tmp) {
          tmp.schoolIds.push(schoolIds[index])
        } else {
          courseTypes.push({ ...type, schoolIds: [schoolIds[index]] })
        }
      })
    })
    dispatch({
      type: GET_ALL_COURSE_TYPES[SUCCESS],
      data: courseTypes
    })
  } catch (error) {
    console.log('Error', error)
    dispatch({ type: GET_ALL_COURSE_TYPES[FAILURE], error })
  }
}

export const loadCourseTypes = ({ schoolId }) => async dispatch => {
  dispatch({ type: GET_COURSE_TYPES[REQUEST] })

  try {
    const courseTypes = await getCourseTypes(schoolId)
    dispatch({
      type: GET_COURSE_TYPES[SUCCESS],
      data: { courseTypes, schoolId }
    })
  } catch (error) {
    console.log('Error', error)
    dispatch({ type: GET_COURSE_TYPES[FAILURE], error })
  }
}

const initialState = {
  ridingExperiences: RidingExperiences,
  courseTypes: []
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_COURSE_TYPES[SUCCESS]: {
      return {
        ...state,
        courseTypes: action.data
      }
    }
    case GET_COURSE_TYPES[SUCCESS]: {
      const courseTypes = state.courseTypes.slice()
      console.log(courseTypes)
      action.data.courseTypes.forEach(course => {
        const tmp = courseTypes.find(x => x.id === course.id)
        if (tmp) {
          if (!tmp.schoolIds.includes(action.data.schoolId)) {
            tmp.schoolIds.push(action.data.schoolId)
          }
        } else {
          courseTypes.push({ ...tmp, schoolIds: [action.data.schoolId] })
        }
      })

      return {
        ...state,
        courseTypes
      }
    }
    default:
      return state
  }
}
