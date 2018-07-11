import { apiGetPendingOrders } from 'services/api'
import * as types from './types'
import {reset as loginReset} from 'scenes/Login/actions'

const pendingOrdersRequest = () => ({ type: types.PENDING_ORDERS_REQUEST })
const pendingOrdersSuccess = (data) => ({ type: types.PENDING_ORDERS_SUCCESS, data })
const pendingOrdersError = (error) => ({ type: types.PENDING_ORDERS_ERROR, error })

export const getPendingOrders = (schoolId, token) => {
  return async (dispatch) => {
    dispatch(pendingOrdersRequest())
    try {
      const response = await apiGetPendingOrders(schoolId, token)
      if(response.status === 200)
        dispatch(pendingOrdersSuccess(response.data))
      else
        throw response
    } catch (error) {
      if(error.response.status === 403) { //Unauthorized access
        dispatch(loginReset())
      } else  {
        dispatch(pendingOrdersError(error.response))
      }
    }
  }
}

