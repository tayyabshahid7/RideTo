import { combineReducers } from 'redux'
import { actions as notificationActions } from './notification'
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

const send = (moduleName, sendFn) => (...args) => dispatch => {
  dispatch({ type: common.constant(moduleName, 'SEND') })

  try {
    return sendFn(...args).then(result => {
      dispatch({
        type: common.constant(moduleName, 'SEND_SUCCESS'),
        result
      })
      const comms = Object.entries(result)
        .filter(([name, value]) => value)
        .map(([name]) =>
          name.replace('email_success', 'Email').replace('sms_success', 'SMS')
        )
        .join(' & ')
      notificationActions.dispatchSuccess(dispatch, `${comms} Sent`)
    })
  } catch (error) {
    dispatch({
      type: common.constant(moduleName, 'ERROR'),
      error
    })
    notificationActions.dispatchError(dispatch, 'Email not sent')
  }
}

const isSending = moduleName => (state = false, action) => {
  switch (action.type) {
    case common.constant(moduleName, 'SEND'):
      return true
    case common.constant(moduleName, 'SEND_SUCCESS'):
      return false
    case common.constant(moduleName, 'ERROR'):
      return false
    default:
      return state
  }
}

actions.fetchOrders = common.fetch(MODULE, orderService.fetchOrders)
actions.fetchSupplierOrders = common.fetch(
  MODULE,
  orderService.fetchSupplierOrders
)
actions.saveTraining = common.save(MODULE, orderService.saveTraining)

actions.sendEmailConfirmation = send(MODULE, orderService.sendConfirmation)

selectors.getItems = ({ results, items }) => {
  return results.map(id => items[id])
}

selectors.getOrdersByCustomer = ({ items }, customerId) => {
  return Object.keys(items)
    .map(id => items[id])
    .filter(({ customer }) => customer === customerId)
}

export default combineReducers({
  items: common.items(MODULE),
  isSaving: common.isSaving(MODULE),
  isSending: isSending(MODULE),
  total: common.total(MODULE),
  isFetching: common.isFetchingItems(MODULE),
  result: common.result(MODULE),
  results: common.results(MODULE)
})
