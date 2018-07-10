import { apiGetPendingOrders } from 'services/api'
import * as types from './types'

const pendingOrdersRequest = () => ({ type: types.PENDING_ORDERS_REQUEST })
const pendingOrdersSuccess = (orders) => ({ type: types.PENDING_ORDERS_SUCCESS, orders })
const pendingOrdersError = (error) => ({ type: types.PENDING_ORDERS_ERROR, error })
const reset = () => ({ type: types.RESET })

export const getPendingOrders = (userEmail, schoolId, token) => {
  return async (dispatch) => {
    dispatch(pendingOrdersRequest())
    try {
      const response = await apiGetPendingOrders(userEmail, schoolId, token)
      if(response.status === 200)
        dispatch(pendingOrdersSuccess(response.data))
      else
        throw "Sorry we couldn't get the data"
    } catch (error) {
      dispatch(pendingOrdersError(error))
    }
  }
}

