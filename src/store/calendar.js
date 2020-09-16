// import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

const SET_SIDEBAR_OPEN = 'rideto/calendar/SET_SIDEBAR_OPEN'
const TOGGLE_USERS = 'rideto/calendar/TOGGLE_USERS'
const TOGGLE_COURSES = 'rideto/calendar/TOGGLE_COURSES'
const RESET_USERS = 'rideto/calendar/RESET_USERS'

export const toggleSidebar = ({ flag }) => async dispatch => {
  dispatch({
    type: SET_SIDEBAR_OPEN,
    data: flag
  })
}

export const resetUsers = () => dispatch => {
  dispatch({
    type: RESET_USERS
  })
}

export const toggleUser = ({ userIds }) => async dispatch => {
  dispatch({
    type: TOGGLE_USERS,
    data: { userIds }
  })
}

export const toggleCourse = ({ courseIds }) => async dispatch => {
  dispatch({
    type: TOGGLE_COURSES,
    data: { courseIds }
  })
}

const initialState = {
  sidebarOpen: false,
  inactiveUsers: [],
  inactiveCourses: []
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
    case RESET_USERS: {
      return {
        ...state,
        inactiveUsers: []
      }
    }
    case TOGGLE_USERS:
      return {
        ...state,
        inactiveUsers: action.data.userIds
      }
    case TOGGLE_COURSES: {
      return {
        ...state,
        inactiveCourses: action.data.courseIds
      }
    }
    default: {
      return state
    }
  }
}
