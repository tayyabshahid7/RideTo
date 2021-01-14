import { fetchInvoices } from 'services/invoice'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'
import { actions as notificationActions } from './notification'

const FETCH_ALL = createRequestTypes('rideto/invoice/FETCH/ALL')

export const getInvoices = params => async dispatch => {
  dispatch({
    type: FETCH_ALL[REQUEST],
    data: { params }
  })

  try {
    const result = await fetchInvoices(params)
    if (!result.data.length) {
      notificationActions.dispatchSuccess(dispatch, 'Nothing to load')
    }

    dispatch({
      type: FETCH_ALL[SUCCESS],
      data: result
    })
  } catch (error) {
    dispatch({ type: FETCH_ALL[FAILURE], error })
  }
}

const initialState = {
  invoices: [],
  loadedAll: false,
  params: {},
  loading: false,
  error: null
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ALL[REQUEST]: {
      return {
        ...state,
        params: action.data.params,
        loading: true
      }
    }
    case FETCH_ALL[SUCCESS]: {
      const id = state.params.starting_after
      let invoices = action.data.data
      if (id) {
        invoices = [...state.invoices, ...action.data.data]
      }

      return {
        ...state,
        loading: false,
        invoices,
        loadedAll: !action.data.data.length // || invoices.length >= action.data.count
      }
    }
    case FETCH_ALL[FAILURE]: {
      return {
        ...state,
        loading: false,
        error: action.error
      }
    }
    default:
      return state
  }
}
