import { RidingExperiences } from 'common/info'
import { getCourseTypes, updateDefaultBikeHire } from 'services/course'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

const GET_COURSE_TYPES = createRequestTypes('rideto/info/GET/COURSE_TYPES')
const GET_ALL_COURSE_TYPES = createRequestTypes(
  'rideto/info/GET/ALL_COURSE_TYPES'
)
const UPDATE_DEFAULT_BIKES = createRequestTypes(
  'rideto/course/UPDATE_DEFAULT_BIKES'
)

export const updateDefaultBikes = (
  settings,
  courseType,
  schoolId
) => async dispatch => {
  dispatch({ type: UPDATE_DEFAULT_BIKES[REQUEST] })
  try {
    await updateDefaultBikeHire(settings, courseType, schoolId)
    dispatch({
      type: UPDATE_DEFAULT_BIKES[SUCCESS],
      data: {
        settings,
        courseType,
        schoolId
      }
    })
  } catch (error) {
    dispatch({ type: UPDATE_DEFAULT_BIKES[FAILURE], error })
  }
}

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
  courseTypes: [],
  saving: false
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
    case UPDATE_DEFAULT_BIKES[REQUEST]: {
      return {
        ...state,
        saving: true
      }
    }
    case UPDATE_DEFAULT_BIKES[SUCCESS]: {
      const courseTypes = state.courseTypes.slice()
      const { settings, courseType, schoolId } = action.data
      const tmp = courseTypes.find(x => x.constant === courseType)
      if (tmp) {
        const bikeSetting = tmp.bike_hire_setup.find(
          x => x.supplier.id === schoolId
        )
        if (bikeSetting) {
          Object.assign(bikeSetting, settings)
        } else {
          tmp.bike_hire_setup.push({
            ...settings,
            supplier: { id: schoolId }
          })
        }
      }

      return {
        ...state,
        saving: false,
        courseTypes
      }
    }
    case UPDATE_DEFAULT_BIKES[FAILURE]: {
      return {
        ...state,
        saving: false
      }
    }

    default:
      return state
  }
}
