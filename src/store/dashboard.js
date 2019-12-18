import {
  apiGetPendingOrders,
  apiGetUnallocatedTests,
  apiHideUnallocatedTest
} from 'services/api'
import { reset as loginReset } from './auth'
import { LOGOUT, RESET } from './common'
export const PENDING_ORDERS_REQUEST = 'PENDING_ORDERS_REQUEST'
export const PENDING_ORDERS_SUCCESS = 'REQUEST_PENDING_ORDERS_SUCCESS'
export const PENDING_ORDERS_ERROR = 'REQUEST_PENDING_ORDERS_ERROR'
export const PENDING_ORDERS_PAGE_CHANGE = 'PENDING_ORDERS_PAGE_CHANGE'
export const UNALLOCATED_TESTS_REQUEST = 'UNALLOCATED_TESTS_REQUEST'
export const UNALLOCATED_TESTS_SUCCESS = 'REQUEST_UNALLOCATED_TESTS_SUCCESS'
export const UNALLOCATED_TESTS_ERROR = 'REQUEST_UNALLOCATED_TESTS_ERROR'
export const HIDE_UNALLOCATED_TEST_REQUEST = 'HIDE_UNALLOCATED_TEST_REQUEST'
export const HIDE_UNALLOCATED_TEST_SUCCESS =
  'REQUEST_HIDE_UNALLOCATED_TEST_SUCCESS'
export const HIDE_UNALLOCATED_TEST_ERROR = 'REQUEST_HIDE_UNALLOCATED_TEST_ERROR'

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

const unallocatedTestsRequest = () => ({
  type: UNALLOCATED_TESTS_REQUEST
})

const unallocatedTestsSuccess = data => ({
  type: UNALLOCATED_TESTS_SUCCESS,
  data
})

const unallocatedTestsError = error => ({
  type: UNALLOCATED_TESTS_ERROR,
  error
})

export const getUnallocatedTests = schoolId => {
  return async dispatch => {
    dispatch(unallocatedTestsRequest())
    try {
      const token = localStorage.getItem('token')
      const response = await apiGetUnallocatedTests(schoolId, token)
      if (response.status === 200) {
        dispatch(unallocatedTestsSuccess(response.data))
      } else {
        throw response
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          //Unauthorized access
          dispatch(loginReset())
        } else {
          dispatch(unallocatedTestsError(error.response))
        }
      } else {
        dispatch(unallocatedTestsError('Check your internet connection'))
      }
    }
  }
}

const hideUnallocatedTestRequest = () => ({
  type: HIDE_UNALLOCATED_TEST_REQUEST
})

const hideUnallocatedTestSuccess = data => ({
  type: HIDE_UNALLOCATED_TEST_SUCCESS,
  data
})

const hideUnallocatedTestError = error => ({
  type: HIDE_UNALLOCATED_TEST_ERROR,
  error
})

export const hideUnallocatedTest = (schoolId, testId) => {
  return async dispatch => {
    dispatch(hideUnallocatedTestRequest())
    try {
      const token = localStorage.getItem('token')
      await apiHideUnallocatedTest(schoolId, testId, token)
      dispatch(hideUnallocatedTestSuccess(testId))
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          //Unauthorized access
          dispatch(loginReset())
        } else {
          dispatch(hideUnallocatedTestError(error.response))
        }
      } else {
        dispatch(hideUnallocatedTestError('Check your internet connection'))
      }
    }
  }
}

const initialState = {
  loading: false,
  error: null,
  pendingOrders: null,
  page: 1,
  unallocatedTests: null
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case PENDING_ORDERS_REQUEST:
    case UNALLOCATED_TESTS_REQUEST:
    case HIDE_UNALLOCATED_TEST_REQUEST:
      return {
        ...state,
        loading: true
      }
    case PENDING_ORDERS_ERROR:
    case UNALLOCATED_TESTS_ERROR:
    case HIDE_UNALLOCATED_TEST_ERROR:
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
    case UNALLOCATED_TESTS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        unallocatedTests: action.data
      }
    case HIDE_UNALLOCATED_TEST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        unallocatedTests: {
          ...state.unallocatedTests,
          count: state.unallocatedTests.count - 1,
          results: state.unallocatedTests.results.filter(
            test => test.id !== action.data
          )
        }
      }
    case LOGOUT:
    case RESET:
      return { ...initialState }
    default:
      return state
  }
}
