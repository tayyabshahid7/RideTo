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

// get instructors for all suppliers
export const getAllInstructors = () => async dispatch => {
  dispatch({ type: FETCH_ALL[REQUEST] })

  try {
    const instructors = await fetchInstructors()
    instructors.forEach(x => {
      x.supplier = x.supplier.map(x => x.id)
      x.name = `${x.first_name} ${x.last_name}`
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

export const newInstructor = data => async dispatch => {
  dispatch({ type: SAVE[REQUEST] })

  try {
    const instructor = await addInstructor(data)
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

export const editInstructor = (id, data) => async dispatch => {
  dispatch({ type: UPDATE[REQUEST] })
  try {
    const instructor = await updateInstructor(id, data)
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

export const deleteInstructor = instructorId => async dispatch => {
  dispatch({ type: DELETE[REQUEST] })

  try {
    const instructor = await removeInstructor(instructorId)
    dispatch({
      type: DELETE[SUCCESS],
      data: { instructor }
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
      const instructors = state.instructors.slice()
      const { instructor } = action.data
      const tmp = instructors.find(x => x.id === instructor.id)
      if (tmp) {
        Object.assign(tmp, instructor)
      } else {
        instructors.push(instructor)
      }

      return {
        ...state,
        saving: false,
        instructors
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
      const instructors = state.instructors.slice()
      const { instructor } = action.data
      const tmp = instructors.find(x => x.id === instructor.id)
      if (tmp) {
        Object.assign(tmp, instructor)
      } else {
        instructors.push(instructor)
      }

      return {
        ...state,
        saving: false,
        instructors
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
      let instructors = state.instructors.slice()
      instructors = instructors.filter(x => x.id !== action.data.instructor.id)

      return {
        ...state,
        saving: false,
        instructors
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
