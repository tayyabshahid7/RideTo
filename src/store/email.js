import { fetchEmails } from 'services/email'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

const FETCH_ALL = createRequestTypes('rideto/email/FETCH/ALL')

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
    default:
      return state
  }
}
