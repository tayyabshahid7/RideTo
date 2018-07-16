  import {apiGetSchoolOrders} from 'services/api'
  import * as types from './types'

  const getSchoolOrdersRequest = () => ({ type: types.GET_SCHOOL_ORDERS_REQUEST })
  const getSchoolOrdersSuccess = (data) => ({ type: types.GET_SCHOOL_ORDERS_SUCCESS, data})
  const getSchoolOrdersError = (error) => ({ type: types.GET_SCHOOL_ORDERS_ERROR, error })

  export const changePage = (page) => ({type: types.ORDERS_CHANGE_PAGE, page})
  export const ordersReducerReset = () => ({ type: types.RESET })


export const getSchoolOrders = (schoolId, page=1) => {
  return async (dispatch) => {
    let token = sessionStorage.getItem('token')
    dispatch(getSchoolOrdersRequest())
    try { 
      const response = await apiGetSchoolOrders(schoolId, page, token)
      if(response.status === 200){
        dispatch(changePage(page))
        dispatch(getSchoolOrdersSuccess(response.data))
      } else {
        throw response
      }
    } catch (error) {
      let errorMessage = 'Unexpected error'
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.status)
        if(error.response.status === 403) {
          errorMessage = 'You are not logged in.'
        } else {
          errorMessage = error.message
        }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
        errorMessage = 'Please check your network connection.'
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error)
        errorMessage = error.message
      }
      dispatch(getSchoolOrdersError(errorMessage))
    }

  }
}

