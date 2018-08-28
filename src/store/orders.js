import { fetchSchoolOrders } from 'services/order'
import { LOGOUT, RESET } from './common'

export const GET_SCHOOL_ORDERS_REQUEST = 'GET_SCHOOL_ORDERS_REQUEST'
export const GET_SCHOOL_ORDERS_SUCCESS = 'GET_SCHOOL_ORDERS_SUCCESS'
export const GET_SCHOOL_ORDERS_ERROR = 'GET_SCHOOL_ORDERS_ERROR'
export const ORDERS_CHANGE_PAGE = 'ORDERS_CHANGE_PAGE'

const getSchoolOrdersRequest = () => ({
  type: GET_SCHOOL_ORDERS_REQUEST
})
const getSchoolOrdersSuccess = data => ({
  type: GET_SCHOOL_ORDERS_SUCCESS,
  data
})
const getSchoolOrdersError = error => ({
  type: GET_SCHOOL_ORDERS_ERROR,
  error
})

export const changePage = page => ({ type: ORDERS_CHANGE_PAGE, page })
export const ordersReducerReset = () => ({ type: RESET })

export const getSchoolOrders = (
  schoolId,
  page = 1,
  sort = null
) => async dispatch => {
  // return async (dispatch) => {
  dispatch(getSchoolOrdersRequest())
  try {
    const response = await fetchSchoolOrders(schoolId, { page, sort })
    if (response.status === 200) {
      dispatch(changePage(page))
      dispatch(getSchoolOrdersSuccess(response.data))
    } else {
      throw response
    }
  } catch (error) {
    let errorMessage = 'Unexpected error'
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.status)
      if (error.response.status === 403) {
        errorMessage = 'You are not logged in.'
      } else {
        errorMessage = error.message
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
      errorMessage = 'Please check your network connection.'
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error)
      errorMessage = error.message
    }
    dispatch(getSchoolOrdersError(errorMessage))
  }

  // }
}

const initialState = {
  loading: false,
  error: null,
  confirmedOrders: null,
  page: 1
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_SCHOOL_ORDERS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case GET_SCHOOL_ORDERS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case GET_SCHOOL_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        confirmedOrders: action.data
      }
    case ORDERS_CHANGE_PAGE:
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
