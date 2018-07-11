import * as types from './types'

const initialState = {
  loading: false,
  error: null,
  pendingOrders: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.PENDING_ORDERS_REQUEST:
      return { 
        ...state,
        loading: true,
      }
    case types.PENDING_ORDERS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      }
    case types.PENDING_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        pendingOrders: action.data.results
      }
    case types.RESET:
      return {...initialState}
    default:
      return state
  }
}
