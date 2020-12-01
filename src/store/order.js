import { combineReducers } from 'redux'
import { actions as notificationActions } from './notification'
import common from 'store/common'
import * as orderService from 'services/order'
import { FAILURE, REQUEST, SUCCESS, createRequestTypes } from './common'
import { saveState, loadState } from 'services/localStorage'

const MODULE = 'order'

export const FETCH = common.constant(MODULE, 'FETCH')
export const FETCH_SUCCESS = common.constant(MODULE, 'FETCH_SUCCESS')
export const SAVE = common.constant(MODULE, 'SAVE')
export const SAVE_SUCCESS = common.constant(MODULE, 'SAVE_SUCCESS')
export const ERROR = common.constant(MODULE, 'ERROR')

const FETCH_ORDER = createRequestTypes('rideto/orders/FETCH')
const LOAD_ORDER_FILTERS = 'rideto/orders/LOAD_ORDER_FILTERS'
const RESET_PARAMS_LOADED = 'rideto/orders/RESET_PARAMS_LOADED'

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

actions.loadOrderState = () => dispatch => {
  dispatch({
    type: LOAD_ORDER_FILTERS
  })
}

actions.resetOrderParamsLoaded = () => dispatch => {
  dispatch({
    type: RESET_PARAMS_LOADED
  })
}

actions.fetchFilteredOrders = params => async dispatch => {
  dispatch({
    type: FETCH_ORDER[REQUEST],
    data: { params }
  })

  try {
    const response = await orderService.fetchFilteredOrders(params)
    notificationActions.dispatchSuccess(dispatch, 'Loaded orders')
    dispatch({
      type: FETCH_ORDER[SUCCESS],
      data: {
        orders: response.results,
        total: response.count
      }
    })
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Failed to load orders')
    dispatch({ type: FETCH_ORDER[FAILURE] })
    return false
  }
  return true
}

const initialState = {
  params: {},
  paramLoaded: false,
  loading: false,
  error: false,
  total: 0,
  orders: []
}

function orderReducer(state = initialState, action) {
  switch (action.type) {
    case RESET_PARAMS_LOADED: {
      return {
        ...state,
        paramLoaded: false
      }
    }
    case LOAD_ORDER_FILTERS: {
      const savedState = loadState()
      let params = {}
      if (
        savedState.order &&
        savedState.order.orders &&
        savedState.order.orders.params
      ) {
        params = savedState.order.orders.params
      }

      return {
        ...state,
        orders: [],
        params,
        paramLoaded: true
      }
    }
    case FETCH_ORDER[REQUEST]: {
      saveState({
        order: {
          orders: {
            params: action.data.params,
            orders: []
          }
        }
      })

      return {
        ...state,
        params: action.data.params,
        loading: true,
        error: false
      }
    }
    case FETCH_ORDER[SUCCESS]: {
      return {
        ...state,
        orders: action.data.orders,
        total: action.data.total,
        loading: false
      }
    }
    case FETCH_ORDER[FAILURE]: {
      return {
        ...state,
        loading: false,
        error: true
      }
    }
    default:
      return state
  }
}

export default combineReducers({
  orders: orderReducer,
  items: common.items(MODULE),
  isSaving: common.isSaving(MODULE),
  isSending: isSending(MODULE),
  total: common.total(MODULE),
  isFetching: common.isFetchingItems(MODULE),
  result: common.result(MODULE),
  results: common.results(MODULE)
})
