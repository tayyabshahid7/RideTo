import { combineReducers } from 'redux'
import { push } from 'connected-react-router'

import common from 'store/common'
import * as customerService from 'services/customer'

const MODULE = 'customer'

export const FETCH = common.constant(MODULE, 'FETCH')
export const FETCH_SUCCESS = common.constant(MODULE, 'FETCH_SUCCESS')
export const FETCH_SINGLE = common.constant(MODULE, 'FETCH_SINGLE')
export const FETCH_SINGLE_SUCCESS = common.constant(
  MODULE,
  'FETCH_SINGLE_SUCCESS'
)
export const SAVE = common.constant(MODULE, 'SAVE')
export const SAVE_SUCCESS = common.constant(MODULE, 'SAVE_SUCCESS')
export const ERROR = common.constant(MODULE, 'ERROR')

export const actions = {}
export const selectors = {}

// Actions
actions.fetchCustomers = common.fetch(MODULE, customerService.fetchCustomers)
actions.fetchCustomer = common.fetchSingle(
  MODULE,
  customerService.fetchCustomer
)

actions.saveCustomer = (customer, history) => dispatch => {
  dispatch({ type: SAVE })

  try {
    return customerService.saveCustomer(customer).then(result => {
      if (!customer.id && result.id) {
        dispatch(push(`/customers/${result.id}`))
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

export default combineReducers({
  items: common.items(MODULE),
  results: common.results(MODULE),
  result: common.result(MODULE),
  total: common.total(MODULE),
  isFetching: common.isFetchingItems(MODULE),
  isSaving: common.isSaving(MODULE)
})
