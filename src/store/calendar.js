// import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

const SET_SIDEBAR_OPEN = 'rideto/calendar/SET_SIDEBAR_OPEN'
const TOGGLE_USERS = 'rideto/calendar/TOGGLE_USERS'
const TOGGLE_COURSES = 'rideto/calendar/TOGGLE_COURSES'

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

export const toggleCourse = ({
  courseIds,
  active = false
}) => async dispatch => {
  dispatch({
    type: TOGGLE_COURSES,
    data: { courseIds, active }
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
    case TOGGLE_USERS:
      return {
        ...state,
        inactiveUsers: action.data.userIds
      }
    case TOGGLE_COURSES: {
      let courses = state.inactiveCourses.slice()
      if (action.data.active) {
        action.data.courseIds.forEach(id => {
          courses = courses.filter(x => x !== id)
        })
      } else {
        action.data.courseIds.forEach(id => {
          if (!courses.includes(id)) {
            courses.push(id)
          }
        })
      }
      return { ...state, inactiveCourses: courses }
    }
    default: {
      return state
    }
  }
}
