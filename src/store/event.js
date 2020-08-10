import {
  fetchSingleEvent,
  fetchEvents,
  deleteSingleEvent,
  updateSchoolEvent,
  createSchoolEvent
} from 'services/event'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

import { actions as notificationActions } from './notification'

import uniqBy from 'lodash/uniqBy'

const FETCH_ALL = createRequestTypes('rideto/event/FETCH/ALL')
const FETCH_FOR_DAY = createRequestTypes('rideto/event/FETCH/DAY')
export const FETCH_SINGLE = createRequestTypes('rideto/event/FETCH/SINGLE')
const DELETE = createRequestTypes('rideto/event/DELETE')
const UPDATE = createRequestTypes('rideto/event/UPDATE')
const CREATE = createRequestTypes('rideto/event/CREATE')

export const getSingleEvent = ({
  eventId,
  reset = false
}) => async dispatch => {
  dispatch({ type: FETCH_SINGLE[REQUEST], reset })

  try {
    const event = await fetchSingleEvent(eventId)
    dispatch({
      type: FETCH_SINGLE[SUCCESS],
      data: {
        event
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_SINGLE[FAILURE], error })
  }
}

export const getDayEvents = ({ schoolIds, date }) => async dispatch => {
  console.log(schoolIds, date)
  dispatch({ type: FETCH_FOR_DAY[REQUEST], date })

  try {
    const request = schoolIds.map(schoolId => fetchEvents(schoolId, date, date))
    const results = await Promise.all(request)

    const events = []
    results.forEach(tmp => events.push(...tmp))

    dispatch({
      type: FETCH_FOR_DAY[SUCCESS],
      data: {
        events
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_FOR_DAY[FAILURE], error })
  }
}

export const deleteEvent = ({ eventId }) => async dispatch => {
  dispatch({ type: DELETE[REQUEST] })

  try {
    await deleteSingleEvent(eventId)
    notificationActions.dispatchSuccess(dispatch, 'Event deleted')
    dispatch({
      type: DELETE[SUCCESS],
      data: {
        eventId
      }
    })
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Failed to delete Event')
    dispatch({ type: DELETE[FAILURE], error })
  }
}

export const getEvents = ({
  schoolId,
  firstDate,
  lastDate,
  month
}) => async dispatch => {
  dispatch({ type: FETCH_ALL[REQUEST] })

  try {
    const events = await fetchEvents(schoolId, firstDate, lastDate)
    dispatch({
      type: FETCH_ALL[SUCCESS],
      data: {
        events,
        month
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_ALL[FAILURE], error })
  }
}

export const updateEvent = ({
  eventId,
  data,
  fullUpdate = false
}) => async dispatch => {
  dispatch({ type: UPDATE[REQUEST] })
  try {
    let response = await updateSchoolEvent(eventId, data, fullUpdate)
    dispatch({
      type: UPDATE[SUCCESS],
      data: { event: response }
    })
    notificationActions.dispatchSuccess(dispatch, 'Event saved')
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Failed to save Event')
    dispatch({ type: UPDATE[FAILURE], error })
  }
}

export const createEvent = ({ schoolId, data }) => async dispatch => {
  dispatch({ type: CREATE[REQUEST] })
  try {
    let response = await createSchoolEvent(schoolId, data)
    dispatch({
      type: CREATE[SUCCESS],
      data: { event: response }
    })
    notificationActions.dispatchSuccess(dispatch, 'Event added')
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Failed to add Event')
    dispatch({ type: CREATE[FAILURE], error })
  }
}

const initialState = {
  single: {
    event: null,
    loading: false,
    saving: false,
    error: null
  },
  day: {
    events: [],
    loading: false,
    error: null
  },
  calendar: {
    events: [],
    loading: false,
    error: null,
    loadedMonths: []
  },
  shift: {
    events: [],
    loading: false,
    error: null
  }
}

export default function reducer(state = initialState, action) {
  let dayEvents
  let calendarEvents
  switch (action.type) {
    case FETCH_SINGLE[REQUEST]:
      if (action.reset) {
        return {
          ...state,
          single: { loading: true, event: null, error: null }
        }
      }
      return {
        ...state,
        single: { ...state.single, loading: true }
      }
    case FETCH_SINGLE[SUCCESS]:
      dayEvents = state.day.events.map(event =>
        event.id !== action.data.event.id ? event : { ...action.data.event }
      )
      calendarEvents = state.calendar.events.map(event =>
        event.id !== action.data.event.id ? event : { ...action.data.event }
      )
      return {
        ...state,
        single: { loading: false, event: action.data.event, error: null },
        day: { ...state.day, events: dayEvents },
        calendar: {
          ...state.calendar,
          events: calendarEvents
        }
      }
    case FETCH_SINGLE[FAILURE]:
      return {
        ...state,
        single: { loading: false, event: null, error: action.error }
      }
    case DELETE[REQUEST]:
      return {
        ...state,
        single: { ...state.single, loading: true }
      }
    case DELETE[SUCCESS]:
      dayEvents = state.day.events.filter(
        event => event.id !== action.data.eventId
      )
      calendarEvents = state.calendar.events.filter(
        event => event.id !== action.data.eventId
      )

      return {
        ...state,
        single: { loading: false, event: null, error: null },
        day: { ...state.day, events: dayEvents },
        calendar: { ...state.calendar, events: calendarEvents }
      }
    case FETCH_FOR_DAY[REQUEST]:
      return {
        ...state,
        day: {
          events: [],
          loading: true
        }
      }
    case FETCH_FOR_DAY[SUCCESS]:
      return {
        ...state,
        day: {
          ...state.day,
          loading: false,
          events: [...action.data.events],
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
    case FETCH_ALL[SUCCESS]: {
      const loadedMonths = state.calendar.loadedMonths.slice()
      if (action.data.month) {
        loadedMonths.push(action.data.month)
      }
      return {
        ...state,
        calendar: {
          ...state.calendar,
          loading: false,
          events: uniqBy(
            [...state.calendar.events, ...action.data.events],
            'id'
          ),
          error: null,
          loadedMonths
        }
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
      dayEvents = state.day.events.map(event =>
        event.id !== action.data.event.id ? event : { ...action.data.event }
      )
      calendarEvents = state.calendar.events.map(event =>
        event.id !== action.data.event.id ? event : { ...action.data.event }
      )
      return {
        ...state,
        single: { saving: false, event: action.data.event, error: null },
        day: { ...state.day, events: dayEvents },
        calendar: { ...state.calendar, events: calendarEvents }
      }
    case UPDATE[FAILURE]:
      return {
        ...state,
        single: { ...state.single, saving: false, error: action.error }
      }
    case CREATE[REQUEST]:
      return {
        ...state,
        single: { event: null, saving: true, error: null }
      }
    case CREATE[SUCCESS]:
      dayEvents =
        action.data.event.date === state.day.date
          ? [action.data.event, ...state.day.events]
          : state.day.events
      calendarEvents = [action.data.event, ...state.calendar.events]
      return {
        ...state,
        single: { saving: false, event: action.data.event, error: null },
        day: { ...state.day, events: dayEvents },
        calendar: { ...state.calendar, events: calendarEvents }
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
