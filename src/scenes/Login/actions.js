// import { apiRequestLogin } from 'services/api'
// import * as types from './types'
// import { getPendingOrders } from 'scenes/Dashboard/actions'
// import { getSchoolOrders } from 'scenes/Orders/actions'

// const loginRequest = () => ({ type: types.LOGIN_REQUEST })
// const loginError = (error) => ({ type: types.LOGIN_ERROR, error })
// const loginSuccess = (data) => ({ type: types.LOGIN_SUCCESS, data })

// const changeSchoolRequest = (school) => ({type: types.CHANGE_SCHOOL, school})

// export const changeSchool = (schoolId, schoolName) => {
//   return async (dispatch) => {
//     dispatch(getPendingOrders(schoolId))
//     dispatch(getSchoolOrders(schoolId))
//     dispatch(changeSchoolRequest({id: schoolId, name:schoolName}))
//   }
// }

// export const reset = () => ({type:types.RESET})

// export const login = (email, password) => {
//   return async (dispatch) => {
//     dispatch(loginRequest())
//     try {
//       const response = await apiRequestLogin(email, password)
//       if(response.status === 200)
//         dispatch(loginSuccess(response.data))
//       else
//         throw response
//     } catch (error) {
//         let errorMessage = 'Unexpected error'
//         if (error.response) {
//             // The request was made and the server responded with a status code
//             // that falls out of the range of 2xx
//             console.log(error.response.status)
//             if(error.response.status === 400) {
//               errorMessage = 'Invalid username or password.'
//             } else {
//               errorMessage = error.message
//             }
//         } else if (error.request) {
//             // The request was made but no response was received
//             // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//             // http.ClientRequest in node.js
//             console.log(error.request)
//             errorMessage = 'Please check your network connection.'
//         } else {
//             // Something happened in setting up the request that triggered an Error
//             console.log('Error', error)
//             errorMessage = error.message
//         }
//         dispatch(loginError(errorMessage))
//     }
//   }
// }
