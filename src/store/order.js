import { combineReducers } from 'redux'

import common from 'store/common'
import * as orderService from 'services/order'

const MODULE = 'order'

export const FETCH = common.constant(MODULE, 'FETCH')
export const FETCH_SUCCESS = common.constant(MODULE, 'FETCH_SUCCESS')
export const SAVE = common.constant(MODULE, 'SAVE')
export const SAVE_SUCCESS = common.constant(MODULE, 'SAVE_SUCCESS')
export const ERROR = common.constant(MODULE, 'ERROR')

export const actions = {}
export const selectors = {}

actions.fetchOrders = common.fetch(MODULE, orderService.fetchOrders)
actions.fetchSupplierOrders = common.fetch(
  MODULE,
  orderService.fetchSupplierOrders
)
actions.saveOrder = common.save(MODULE, orderService.saveOrder)

selectors.getItems = ({ results, items }) => {
  return results.map(id => items[id])
}

selectors.getOrdersByCustomer = ({ items }, customerId) => {
  return Object.keys(items)
    .map(id => items[id])
    .filter(({ customer }) => customer === customerId)
}

export default combineReducers({
  items: common.items(MODULE, 'friendly_id'),
  isSaving: common.isSaving(MODULE),
  total: common.total(MODULE),
  isFetching: common.isFetchingItems(MODULE),
  result: common.result(MODULE, 'friendly_id'),
  results: common.results(MODULE, 'friendly_id')
})
