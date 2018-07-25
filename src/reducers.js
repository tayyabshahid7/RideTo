// import { combineReducers } from 'redux'
// import { default as login } from 'scenes/Login/reducer'
// import { default as dashboard } from 'scenes/Dashboard/reducer'
// import { default as orders } from 'scenes/Orders/reducer'
// import { SIGNOUT_REQUEST } from 'types'
// import { clearState } from 'services/localStorage'
// const appReducer = combineReducers({
//   login,
//   dashboard,
//   orders,
// })

// export default (state, action) => {
//     if (action.type === SIGNOUT_REQUEST) {
//         clearState()
//         state = undefined
//         localStorage.removeItem('token')
//     }
//     return appReducer(state, action)
// }

// // See
// // https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store
// // for more detail
