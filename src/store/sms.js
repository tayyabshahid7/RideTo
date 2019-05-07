import {
  fetchCredits as fetchCreditsApi,
  purchaseCredits as purchaseCreditsApi
} from 'services/sms'
import { REQUEST, SUCCESS, FAILURE, createRequestTypes } from './common'
import { actions as notificationActions } from './notification'

const FETCH_CREDITS = createRequestTypes('FETCH_CREDITS')
const PURCHASE_CREDITS = createRequestTypes('PURCHASE_CREDITS')

export const fetchCredits = ({ schoolId }) => async dispatch => {
  dispatch({ type: FETCH_CREDITS[REQUEST] })
  try {
    const response = await fetchCreditsApi(schoolId)
    dispatch({
      type: FETCH_CREDITS[SUCCESS],
      data: response
    })
  } catch (error) {
    dispatch({ type: FETCH_CREDITS[FAILURE], error })
  }
}

export const purchaseCredits = (schoolId, data) => async dispatch => {
  dispatch({ type: PURCHASE_CREDITS[REQUEST] })
  try {
    const response = await purchaseCreditsApi(schoolId, data)
    notificationActions.dispatchSuccess(dispatch, 'Credits added')
    dispatch({
      type: PURCHASE_CREDITS[SUCCESS],
      data: response
    })
  } catch (error) {
    const message = error.response.data.detail
    notificationActions.dispatchError(
      dispatch,
      `Failed to take payment. ${message}`
    )
    dispatch({ type: PURCHASE_CREDITS[FAILURE], error })
    return false
  }
  return true
}

const initialState = {
  credit_unit: null,
  sms_credit: null,
  loading: false,
  error: null
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CREDITS[REQUEST]:
      return {
        ...state,
        loading: true,
        error: null
      }
    case FETCH_CREDITS[SUCCESS]:
      return {
        ...state,
        credit_unit: action.data.credit_unit,
        sms_credit: action.data.sms_credit,
        loading: false,
        error: null
      }
    case FETCH_CREDITS[FAILURE]:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case PURCHASE_CREDITS[REQUEST]:
      return {
        ...state,
        loading: true,
        error: null
      }
    case PURCHASE_CREDITS[SUCCESS]:
      return {
        ...state,
        credit_unit: action.data.result.credit_unit,
        loading: false,
        error: null
      }
    case PURCHASE_CREDITS[FAILURE]:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return state
  }
}
