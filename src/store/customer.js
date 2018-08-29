import { combineReducers } from 'redux'

import { normalize } from 'store/common'
import * as customerService from 'services/customer'

const MODULE = 'customer'

export const FETCH = `rideto/${MODULE}/FETCH`
export const FETCH_SUCCESS = `rideto/${MODULE}/FETCH_SUCCESS`
export const SAVE = `rideto/${MODULE}/SAVE`
export const SAVE_SUCCESS = `rideto/${MODULE}/SAVE_SUCCESS`
export const ERROR = `rideto/${MODULE}/ERROR`

export const actions = {}
export const selectors = {}

// Actions
actions.fetchCustomers = (...args) => dispatch => {
  dispatch({ type: FETCH })

  try {
    return customerService.fetchCustomers(...args).then(res => {
      dispatch({
        type: FETCH_SUCCESS,
        result: res || {}
      })
    })
  } catch (error) {
    dispatch({
      type: ERROR,
      error
    })
  }
}

actions.fetchCustomer = (...args) => dispatch => {
  dispatch({ type: FETCH })

  try {
    return customerService.fetchCustomer(...args).then(res => {
      dispatch({
        type: FETCH_SUCCESS,
        result: { results: [res], count: 1 }
      })
    })
  } catch (error) {
    dispatch({
      type: ERROR,
      error
    })
  }
}

actions.saveCustomer = (customer, history) => dispatch => {
  dispatch({ type: SAVE })

  try {
    return customerService.saveCustomer(customer).then(result => {
      if (!customer.id && result.id) {
        history.push(`/customers/${result.id}`)
      }

      dispatch({
        type: SAVE_SUCCESS,
        result
      })
    })
  } catch (error) {
    dispatch({
      type: ERROR,
      error
    })
  }
}

selectors.getItems = ({ results, items }) => {
  return results.map(id => items[id])
}

selectors.getItem = ({ results, items }, id) => {
  return items[id]
}

const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH:
      return true
    case FETCH_SUCCESS:
      return false
    default:
      return state
  }
}

const total = (state = 0, action) => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return action.result.count
    default:
      return state
  }
}

const results = (state = [], action) => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return action.result.results.map(r => r.id)
    default:
      return state
  }
}

const result = (state = null, action) => {
  switch (action.type) {
    case FETCH:
      return null
    case SAVE:
      return null
    case SAVE_SUCCESS:
      return action.result.id
    default:
      return state
  }
}

const items = (state = {}, action) => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        ...normalize(action.result.results)
      }
    case SAVE_SUCCESS:
      return {
        ...state,
        ...normalize([action.result])
      }
    default:
      return state
  }
}

export default combineReducers({
  items,
  results,
  result,
  total,
  isFetching
})
