// import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

const SET_SIDEBAR_OPEN = 'rideto/calendar/SET_SIDEBAR_OPEN'
const TOGGLE_USERS = 'rideto/calendar/TOGGLE_USERS'
const TOGGLE_COURSES = 'rideto/calendar/TOGGLE_COURSES'
const SIDE_PANEL_MOUNTED = 'rideto/calendar/SIDE_PANEL_MOUNTED'

export const toggleSidePanel = flag => async dispatch => {
  dispatch({
    type: SIDE_PANEL_MOUNTED,
    data: flag
  })
}

export const toggleSidebar = ({ flag }) => async dispatch => {
  dispatch({
    type: SET_SIDEBAR_OPEN,
    data: flag
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
  sidePanel: false,
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
    case SIDE_PANEL_MOUNTED: {
      console.log(action.data)
      return { ...state, sidePanel: !!action.data }
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
