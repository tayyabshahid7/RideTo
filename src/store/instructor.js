import _ from 'lodash'
import {
  fetchInstructors,
  addInstructor,
  updateInstructor,
  removeInstructor
} from 'services/instructor'
import { actions as notificationActions } from './notification'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

const module = 'rideto/instructor'
const FETCH_SINGLE = createRequestTypes(`${module}/FETCH/SINGLE`)
const FETCH_ALL = createRequestTypes(`${module}/FETCH/ALL`)
const SAVE = createRequestTypes(`${module}/SAVE`)
const UPDATE = createRequestTypes(`${module}/UPDATE`)
const DELETE = createRequestTypes(`${module}/DELETE`)

// get instructors for all suppliers
export const getAllInstructors = schoolIds => async dispatch => {
  dispatch({ type: FETCH_ALL[REQUEST] })

  try {
    const requests = schoolIds.map(schoolId => fetchInstructors(schoolId))
    const result = await Promise.all(requests)
    const instructors = {}
    schoolIds.forEach((schoolId, index) => {
      instructors[schoolId] = result[index]
    })

    dispatch({
      type: FETCH_ALL[SUCCESS],
      data: {
        instructors
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_ALL[FAILURE], error })
  }
}

// get instructors for specific supplier
export const getInstructors = schoolId => async dispatch => {
  dispatch({ type: FETCH_SINGLE[REQUEST] })

  try {
    const instructors = await fetchInstructors(schoolId)
    dispatch({
      type: FETCH_SINGLE[SUCCESS],
      data: { instructors, schoolId }
    })
  } catch (error) {
    dispatch({ type: FETCH_SINGLE[FAILURE], error })
  }
}

export const newInstructor = (schoolId, data) => async dispatch => {
  dispatch({ type: SAVE[REQUEST] })

  try {
    const instructor = await addInstructor(schoolId, data)
    dispatch({
      type: SAVE[SUCCESS],
      data: { instructor, schoolId }
    })
    notificationActions.dispatchSuccess(dispatch, 'Instructor added.')
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Could not add instructor.')
    dispatch({ type: SAVE[FAILURE], error })
  }
}

export const editInstructor = (schoolId, data) => async dispatch => {
  dispatch({ type: UPDATE[REQUEST] })
  try {
    const instructor = await updateInstructor(schoolId, data)
    dispatch({
      type: UPDATE[SUCCESS],
      data: { instructor, schoolId }
    })
    notificationActions.dispatchSuccess(dispatch, 'Instructor edited.')
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Could not edit instructor.')
    dispatch({ type: UPDATE[FAILURE], error })
  }
}

export const deleteInstructor = (schoolId, instructorId) => async dispatch => {
  dispatch({ type: DELETE[REQUEST] })

  try {
    const instructor = await removeInstructor(schoolId, instructorId)
    dispatch({
      type: DELETE[SUCCESS],
      data: { instructor, schoolId }
    })
    notificationActions.dispatchSuccess(dispatch, 'Instructor deleted.')
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Could not delete Instructor.')
    dispatch({ type: DELETE[FAILURE], error })
  }
}

const initialState = {
  instructors: [],
  loading: false,
  saving: false,
  error: null,
  loadedAll: false
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SINGLE[REQUEST]:
      return {
        ...state,
        loading: true
      }
    case FETCH_SINGLE[SUCCESS]: {
      const { instructors } = state
      instructors[action.data.schoolId] = action.data.instructors
      return {
        ...state,
        loading: false,
        instructors: _.cloneDeep(instructors)
      }
    }
    case FETCH_SINGLE[FAILURE]:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case FETCH_ALL[REQUEST]:
      return {
        ...state,
        loading: true
      }
    case FETCH_ALL[SUCCESS]: {
      return {
        ...state,
        loading: false,
        loadedAll: true,
        instructors: action.data.instructors
      }
    }
    case FETCH_ALL[FAILURE]:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case SAVE[REQUEST]:
      return {
        ...state,
        saving: true
      }
    case SAVE[SUCCESS]: {
      const { instructors } = state
      instructors[action.data.schoolId].push(action.data.instructor)

      return {
        ...state,
        saving: false,
        instructors: _.cloneDeep(instructors)
      }
    }
    case SAVE[FAILURE]:
      return {
        ...state,
        saving: false,
        error: action.error
      }
    case UPDATE[REQUEST]:
      return {
        ...state,
        saving: true
      }
    case UPDATE[SUCCESS]: {
      const { instructors } = state
      const { instructor, schoolId } = action.data
      const tmp = instructors[schoolId].find(x => x.id === instructor.id)
      if (tmp) {
        Object.assign(tmp, instructor)
      } else {
        instructors[schoolId].push(instructor)
      }
      return {
        ...state,
        saving: false,
        instructors: _.cloneDeep(instructors)
      }
    }
    case UPDATE[FAILURE]:
      return {
        ...state,
        saving: false,
        error: action.error
      }
    case DELETE[REQUEST]:
      return {
        ...state,
        saving: true
      }
    case DELETE[SUCCESS]: {
      const { schoolId, instructor } = action.data
      const { instructors } = state
      instructors[schoolId] = instructors[schoolId].filter(
        x => x.id !== instructor.id
      )
      return {
        ...state,
        saving: false,
        instructors: _.cloneDeep(instructors)
      }
    }
    case DELETE[FAILURE]:
      return {
        ...state,
        saving: false,
        error: action.error
      }
    default:
      return state
  }
}
