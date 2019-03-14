import {
  fetchInstructors,
  addInstructor,
  updateInstructor,
  removeInstructor
} from 'services/instructor'
import { actions as notificationActions } from './notification'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

const module = 'rideto/instructor'
const FETCH_ALL = createRequestTypes(`${module}/FETCH/ALL`)
const SAVE = createRequestTypes(`${module}/SAVE`)
const UPDATE = createRequestTypes(`${module}/UPDATE`)
const DELETE = createRequestTypes(`${module}/DELETE`)

export const getInstructors = schoolId => async dispatch => {
  dispatch({ type: FETCH_ALL[REQUEST] })

  try {
    const instructors = await fetchInstructors(schoolId)
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

export const newInstructor = (schoolId, data) => async dispatch => {
  dispatch({ type: SAVE[REQUEST] })

  try {
    const instructor = await addInstructor(schoolId, data)
    dispatch({
      type: SAVE[SUCCESS],
      data: { instructor }
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
      data: { instructor }
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
    const result = await removeInstructor(schoolId, instructorId)
    dispatch({
      type: DELETE[SUCCESS],
      data: result
    })
    notificationActions.dispatchSuccess(dispatch, 'Instructor deleted.')
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Could not delete Instructor.')
    dispatch({ type: DELETE[FAILURE], error })
  }
}

const initialState = {
  instructors: [],
  selectedInstructor: null,
  loading: false,
  saving: false,
  error: null
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ALL[REQUEST]:
      return {
        ...state,
        loading: true
      }
    case FETCH_ALL[SUCCESS]:
      return {
        ...state,
        loading: false,
        instructors: [...action.data.instructors]
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
    case SAVE[SUCCESS]:
      return {
        ...state,
        saving: false,
        instructors: [...state.instructors, action.data.instructor],
        selectedInstructor: { ...action.data.instructor }
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
    case UPDATE[SUCCESS]:
      const updatedInstructor = action.data.instructor
      const updatedInstructors = state.instructors.filter(
        instructor => instructor.id !== updatedInstructor.id
      )
      return {
        ...state,
        saving: false,
        instructors: [...updatedInstructors, updatedInstructor],
        selectedInstructor: { ...updatedInstructor }
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
    case DELETE[SUCCESS]:
      const deletedId = action.data.id
      const newInstructors = state.instructors.filter(
        instructor => instructor.id !== deletedId
      )
      return {
        ...state,
        instructors: [...newInstructors],
        saving: false,
        selectedInstructor: null
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
