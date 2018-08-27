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

selectors.getItems = ({ results, items }) => {
  console.log(results, items)
  return results.map(id => items[id])
}

const results = (state = [], action) => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return action.result.results.map(r => r.id)
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
        [action.item.id]: action.item
      }
    default:
      return state
  }
}

export default combineReducers({
  items,
  results
})
