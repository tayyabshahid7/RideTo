import { combineReducers } from 'redux'
import { push } from 'connected-react-router'

import { actions as notificationActions } from './notification'

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
export const DESTROY = common.constant(MODULE, 'DESTROY')
export const DESTROY_SUCCESS = common.constant(MODULE, 'DESTROY_SUCCESS')
export const ERROR = common.constant(MODULE, 'ERROR')

export const actions = {}
export const selectors = {}

// Actions
actions.fetchCustomers = common.fetch(MODULE, customerService.fetchCustomers)
actions.fetchCustomer = common.fetchSingle(
  MODULE,
  customerService.fetchCustomer
)

actions.destroyCustomer = common.destroy(
  MODULE,
  customerService.destroyCustomer
)

actions.saveCustomer = (customer, history) => async dispatch => {
  dispatch({ type: SAVE })

  try {
    const result = await customerService.saveCustomer(customer)
    if (!customer.id && result.id) {
      dispatch(push(`/customers/${result.id}`))
    }

    notificationActions.dispatchSuccess(dispatch, 'Customer saved')

    dispatch({
      type: SAVE_SUCCESS,
      result
    })
  } catch (error) {
    notificationActions.dispatchError(
      dispatch,
      'Customer not saved. ' + error.response.data.detail
    )

    dispatch({
      type: ERROR,
      error: error.response
    })
  }
}

selectors.getItems = ({ results, items }) => {
  return results.map(id => items[id])
}

selectors.getItem = ({ items }, id) => {
  return items[id]
}

export default combineReducers({
  items: common.items(MODULE),
  results: common.results(MODULE),
  result: common.result(MODULE),
  total: common.total(MODULE),
  isFetching: common.isFetchingItems(MODULE),
  isSaving: common.isSaving(MODULE),
  error: common.error(MODULE)
})
