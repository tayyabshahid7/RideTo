import { fetchInvoices } from 'services/invoice'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

const FETCH_ALL = createRequestTypes('rideto/invoice/FETCH/ALL')

export const getInvoices = params => async dispatch => {
  dispatch({
    type: FETCH_ALL[REQUEST],
    data: { params }
  })

  try {
    const invoices = await fetchInvoices(params)
    dispatch({
      type: FETCH_ALL[SUCCESS],
      data: {
        invoices
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_ALL[FAILURE], error })
  }
}

const initialState = {
  invoices: [],
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
      return {
        ...state,
        loading: false,
        invoices: action.data.invoices
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
