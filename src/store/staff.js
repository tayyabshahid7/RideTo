import {
  fetchSingleStaff,
  fetchStaff,
  deleteSingleStaff,
  updateSchoolStaff,
  createSchoolStaff
} from 'services/staff'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

import { actions as notificationActions } from './notification'

import uniqBy from 'lodash/uniqBy'

const FETCH_ALL = createRequestTypes('rideto/staff/FETCH/ALL')
const FETCH_FOR_DAY = createRequestTypes('rideto/staff/FETCH/DAY')
export const FETCH_SINGLE = createRequestTypes('rideto/staff/FETCH/SINGLE')
const DELETE = createRequestTypes('rideto/staff/DELETE')
const UPDATE = createRequestTypes('rideto/staff/UPDATE')
const CREATE = createRequestTypes('rideto/staff/CREATE')

export const getSingleStaff = ({
  schoolId,
  staffId,
  reset = false,
  diaryId
}) => async dispatch => {
  dispatch({ type: FETCH_SINGLE[REQUEST], reset })

  try {
    const staff = await fetchSingleStaff(schoolId, staffId, diaryId)
    dispatch({
      type: FETCH_SINGLE[SUCCESS],
      data: {
        staff
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_SINGLE[FAILURE], error })
  }
}

export const getDayStaff = ({ schoolId, date }) => async dispatch => {
  dispatch({ type: FETCH_FOR_DAY[REQUEST], date })

  try {
    const { results: staff } = await fetchStaff(schoolId, date, date)

    dispatch({
      type: FETCH_FOR_DAY[SUCCESS],
      data: {
        staff
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_FOR_DAY[FAILURE], error })
  }
}

export const deleteStaff = ({
  schoolId,
  staffId,
  diaryId
}) => async dispatch => {
  dispatch({ type: DELETE[REQUEST] })

  try {
    await deleteSingleStaff(schoolId, staffId, diaryId)
    notificationActions.dispatchSuccess(dispatch, 'Staff deleted')
    dispatch({
      type: DELETE[SUCCESS],
      data: {
        staffId
      }
    })
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Failed to delete Staff')
    dispatch({ type: DELETE[FAILURE], error })
  }
}

export const getStaff = ({
  schoolId,
  firstDate,
  lastDate,
  month
}) => async dispatch => {
  dispatch({ type: FETCH_ALL[REQUEST] })

  try {
    const { results: staff } = await fetchStaff(schoolId, firstDate, lastDate)
    dispatch({
      type: FETCH_ALL[SUCCESS],
      data: {
        staff,
        month
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_ALL[FAILURE], error })
  }
}

export const updateStaff = ({
  schoolId,
  staffId,
  diaryId,
  data,
  fullUpdate = false
}) => async dispatch => {
  dispatch({ type: UPDATE[REQUEST] })
  try {
    let response = await updateSchoolStaff(
      schoolId,
      staffId,
      diaryId,
      data,
      fullUpdate
    )
    dispatch({
      type: UPDATE[SUCCESS],
      data: { staff: response }
    })
    notificationActions.dispatchSuccess(dispatch, 'Staff saved')
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Failed to save Staff')
    dispatch({ type: UPDATE[FAILURE], error })
  }
}

export const createStaff = ({ schoolId, data }) => async dispatch => {
  dispatch({ type: CREATE[REQUEST] })
  try {
    let response = await createSchoolStaff(schoolId, data)
    dispatch({
      type: CREATE[SUCCESS],
      data: { staff: response }
    })
    notificationActions.dispatchSuccess(dispatch, 'Staff added')
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Failed to add Staff')
    dispatch({ type: CREATE[FAILURE], error })
  }
}

const initialState = {
  single: {
    staff: null,
    loading: false,
    saving: false,
    error: null
  },
  day: {
    staff: [],
    loading: false,
    error: null
  },
  calendar: {
    staff: [],
    loading: false,
    error: null,
    loadedMonths: []
  }
}

export default function reducer(state = initialState, action) {
  let dayStaff
  let calendarStaff
  switch (action.type) {
    case FETCH_SINGLE[REQUEST]:
      if (action.reset) {
        return {
          ...state,
          single: { loading: true, staff: null, error: null }
        }
      }
      return {
        ...state,
        single: { ...state.single, loading: true }
      }
    case FETCH_SINGLE[SUCCESS]:
      dayStaff = state.day.staff.map(staff =>
        staff.id !== action.data.staff.id ? staff : { ...action.data.staff }
      )
      calendarStaff = state.calendar.staff.map(staff =>
        staff.id !== action.data.staff.id ? staff : { ...action.data.staff }
      )
      return {
        ...state,
        single: { loading: false, staff: action.data.staff, error: null },
        day: { ...state.day, staff: dayStaff },
        calendar: {
          ...state.calendar,
          staff: calendarStaff
        }
      }
    case FETCH_SINGLE[FAILURE]:
      return {
        ...state,
        single: { loading: false, staff: null, error: action.error }
      }
    case DELETE[REQUEST]:
      return {
        ...state,
        single: { loading: true }
      }
    case DELETE[SUCCESS]:
      dayStaff = state.day.staff.filter(
        staff => staff.id !== action.data.staffId
      )
      calendarStaff = state.calendar.staff.filter(
        staff => staff.id !== action.data.staffId
      )

      return {
        ...state,
        single: { loading: false, staff: null, error: null },
        day: { ...state.day, staff: dayStaff },
        calendar: { ...state.calendar, staff: calendarStaff }
      }
    case FETCH_FOR_DAY[REQUEST]:
      return {
        ...state,
        day: {
          staff: [],
          loading: true
        }
      }
    case FETCH_FOR_DAY[SUCCESS]:
      return {
        ...state,
        day: {
          ...state.day,
          loading: false,
          staff: [...action.data.staff],
          error: null
        }
      }
    case FETCH_FOR_DAY[FAILURE]:
      return {
        ...state,
        day: {
          ...state.day,
          loading: false,
          error: action.error
        }
      }
    case FETCH_ALL[REQUEST]:
      return {
        ...state,
        calendar: {
          ...state.calendar,
          loading: true
        }
      }
    case FETCH_ALL[SUCCESS]:
      return {
        ...state,
        calendar: {
          ...state.calendar,
          loading: false,
          staff: uniqBy([...state.calendar.staff, ...action.data.staff], 'id'),
          error: null,
          loadedMonths: [...state.calendar.loadedMonths, action.data.month]
        }
      }
    case FETCH_ALL[FAILURE]:
      return {
        ...state,
        calendar: {
          ...state.calendar,
          loading: false,
          error: action.error
        }
      }
    case UPDATE[REQUEST]:
      return {
        ...state,
        single: { ...state.single, saving: true, error: null }
      }
    case UPDATE[SUCCESS]:
      dayStaff = state.day.staff.map(staff =>
        staff.id !== action.data.staff.id ? staff : { ...action.data.staff }
      )
      calendarStaff = state.calendar.staff.map(staff =>
        staff.id !== action.data.staff.id ? staff : { ...action.data.staff }
      )
      return {
        ...state,
        single: { saving: false, staff: action.data.staff, error: null },
        day: { ...state.day, staff: dayStaff },
        calendar: { ...state.calendar, staff: calendarStaff }
      }
    case UPDATE[FAILURE]:
      return {
        ...state,
        single: { ...state.single, saving: false, error: action.error }
      }
    case CREATE[REQUEST]:
      return {
        ...state,
        single: { staff: null, saving: true, error: null }
      }
    case CREATE[SUCCESS]:
      dayStaff =
        action.data.staff.date === state.day.date
          ? [action.data.staff, ...state.day.staff]
          : state.day.staff
      calendarStaff = [action.data.staff, ...state.calendar.staff]
      return {
        ...state,
        single: { saving: false, staff: action.data.staff, error: null },
        day: { ...state.day, staff: dayStaff },
        calendar: { ...state.calendar, staff: calendarStaff }
      }
    case CREATE[FAILURE]:
      return {
        ...state,
        single: { ...state.single, saving: false, error: action.error }
      }
    default:
      return state
  }
}
