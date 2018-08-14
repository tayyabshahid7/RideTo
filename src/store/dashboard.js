import { apiGetPendingOrders } from 'services/api'
import { reset as loginReset } from './auth'
import { LOGOUT, RESET } from './common'
export const PENDING_ORDERS_REQUEST = 'PENDING_ORDERS_REQUEST'
export const PENDING_ORDERS_SUCCESS = 'REQUEST_PENDING_ORDERS_SUCCESS'
export const PENDING_ORDERS_ERROR = 'REQUEST_PENDING_ORDERS_ERROR'
export const PENDING_ORDERS_PAGE_CHANGE = 'PENDING_ORDERS_PAGE_CHANGE'

const pendingOrdersRequest = () => ({ type: PENDING_ORDERS_REQUEST })
const pendingOrdersSuccess = data => ({
  type: PENDING_ORDERS_SUCCESS,
  data
})

const pendingOrdersError = error => ({
  type: PENDING_ORDERS_ERROR,
  error
})

export const changePage = page => ({
  type: PENDING_ORDERS_PAGE_CHANGE,
  page
})

export const getPendingOrders = (schoolId, page = 1, sorting = null) => {
  return async dispatch => {
    dispatch(pendingOrdersRequest())
    try {
      const token = localStorage.getItem('token')
      const response = await apiGetPendingOrders(schoolId, page, sorting, token)
      if (response.status === 200) {
        dispatch(changePage(page))
        dispatch(pendingOrdersSuccess(response.data))
      } else {
        throw response
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          //Unauthorized access
          dispatch(loginReset())
        } else {
          dispatch(pendingOrdersError(error.response))
        }
      } else {
        dispatch(pendingOrdersError('Check your internet connection'))
      }
    }
  }
}

const initialState = {
  loading: false,
  error: null,
  pendingOrders: null,
  page: 1
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case PENDING_ORDERS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case PENDING_ORDERS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case PENDING_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        pendingOrders: action.data
      }
    case PENDING_ORDERS_PAGE_CHANGE:
      return {
        ...state,
        page: action.page
      }
    case LOGOUT:
    case RESET:
      return { ...initialState }
    default:
      return state
  }
}
