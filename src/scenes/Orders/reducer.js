import * as types from './types'

const initialState = {
  loading: false,
  error: null,
  confirmedOrders: null,
  page:1,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_SCHOOL_ORDERS_REQUEST:
      return { 
        ...state,
        loading: true,
      }
    case types.GET_SCHOOL_ORDERS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      }
    case types.GET_SCHOOL_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        confirmedOrders: action.data,
      }
    case types.ORDERS_CHANGE_PAGE:
      return {
        ...state,
        page: action.page,
      }
    case types.RESET:
      return {...initialState}
    default:
      return state
  }
}