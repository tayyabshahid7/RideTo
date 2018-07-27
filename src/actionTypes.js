export const REQUEST = 'REQUEST'
export const SUCCESS = 'SUCCESS'
export const FAILURE = 'FAILURE'

function createRequestTypes(base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
    acc[type] = `${base}_${type}`
    return acc
  }, {})
}

export const PENDING_ORDERS_REQUEST = 'PENDING_ORDERS_REQUEST'
export const PENDING_ORDERS_SUCCESS = 'REQUEST_PENDING_ORDERS_SUCCESS'
export const PENDING_ORDERS_ERROR = 'REQUEST_PENDING_ORDERS_ERROR'
export const PENDING_ORDERS_PAGE_CHANGE = 'PENDING_ORDERS_PAGE_CHANGE'

export const CHANGE_SCHOOL = 'CHANGE_SCHOOL'
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_ERROR = 'LOGIN_ERROR'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGOUT = 'LOGOUT'
export const RESET = 'RESET'

export const GET_SCHOOL_ORDERS_REQUEST = 'GET_SCHOOL_ORDERS_REQUEST'
export const GET_SCHOOL_ORDERS_SUCCESS = 'GET_SCHOOL_ORDERS_SUCCESS'
export const GET_SCHOOL_ORDERS_ERROR = 'GET_SCHOOL_ORDERS_ERROR'
export const ORDERS_CHANGE_PAGE = 'ORDERS_CHANGE_PAGE'

export const COURSES_FETCH = createRequestTypes('COURSES_FETCH')
