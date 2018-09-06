import { combineReducers } from 'redux'

import common from 'store/common'
import * as service from 'services/supplier'

const MODULE = 'supplier'

export const FETCH = common.constant(MODULE, 'FETCH')
export const FETCH_SUCCESS = common.constant(MODULE, 'FETCH_SUCCESS')
export const ERROR = common.constant(MODULE, 'ERROR')

export const actions = {}
export const selectors = {}

actions.fetchSuppliers = common.fetch(MODULE, service.fetchSuppliers)

selectors.getItems = ({ results, items }) => {
  return results.map(id => items[id])
}

export default combineReducers({
  items: common.items(MODULE),
  results: common.results(MODULE)
})
