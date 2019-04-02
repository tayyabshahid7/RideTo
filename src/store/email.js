import { fetchEmails, fireEmail } from 'services/email'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'
import { actions as notificationActions } from './notification'

const FETCH_ALL = createRequestTypes('rideto/email/FETCH/ALL')
const SEND = createRequestTypes('rideto/email/SEND')

export const getEmails = customerId => async dispatch => {
  dispatch({ type: FETCH_ALL[REQUEST] })

  try {
    const emails = await fetchEmails(customerId)
    dispatch({
      type: FETCH_ALL[SUCCESS],
      data: {
        emails
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_ALL[FAILURE], error })
  }
}

export const sendEmail = email => async dispatch => {
  dispatch({ type: SEND[REQUEST] })

  try {
    await fireEmail(email)
    dispatch({
      type: SEND[SUCCESS],
      data: {
        email
      }
    })
    notificationActions.dispatchSuccess(dispatch, 'Email sent')
  } catch (error) {
    dispatch({ type: SEND[FAILURE], error })
    notificationActions.dispatchError(dispatch, 'Failed to send email')
    return false
  }

  return true
}

const initialState = {
  emails: [],
  loading: false,
  error: null
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ALL[REQUEST]:
      return {
        ...state,
        loading: true,
        error: null
      }
    case FETCH_ALL[SUCCESS]:
      return {
        ...state,
        emails: action.data.emails,
        loading: false,
        error: null
      }
    case FETCH_ALL[FAILURE]:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case SEND[REQUEST]:
      return {
        ...state,
        loading: true,
        error: null
      }
    case SEND[SUCCESS]:
      return {
        ...state,
        emails: [action.data.email, ...state.emails],
        loading: false,
        error: null
      }
    case SEND[FAILURE]:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return state
  }
}
