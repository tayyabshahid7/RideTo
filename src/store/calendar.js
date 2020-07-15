// import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

const SET_SIDEBAR_OPEN = 'rideto/calendar/SET_SIDEBAR_OPEN'
const TOGGLE_USERS = 'rideto/calendar/TOGGLE_USERS'

export const toggleSidebar = ({ flag }) => async dispatch => {
  dispatch({
    type: SET_SIDEBAR_OPEN,
    data: flag
  })
}

export const toggleUser = ({ userIds, active = false }) => async dispatch => {
  dispatch({
    type: TOGGLE_USERS,
    data: { userIds, active }
  })
}

const initialState = {
  sidebarOpen: false,
  inactiveUsers: []
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_SIDEBAR_OPEN: {
      let sidebarOpen = !state.sidebarOpen
      if (typeof action.data !== 'undefined') {
        sidebarOpen = action.data
      }
      return { ...state, sidebarOpen }
    }
    case TOGGLE_USERS: {
      let users = state.inactiveUsers.slice()
      if (action.data.active) {
        action.data.userIds.forEach(userId => {
          users = users.filter(x => x !== userId)
        })
      } else {
        action.data.userIds.forEach(userId => {
          if (!users.includes(userId)) {
            users.push(userId)
          }
        })
      }
      console.log(users)
      return { ...state, inactiveUsers: users }
    }
    default: {
      return state
    }
  }
}
