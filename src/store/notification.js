import { combineReducers } from 'redux'

import common from 'store/common'

const MODULE = 'notification'
export const SHOW = common.constant(MODULE, 'SHOW')
export const DISMISS = common.constant(MODULE, 'DISMISS')

export const actions = {}

actions.showNotification = (
  title,
  content = '',
  color = 'primary',
  duration = 3000
) => dispatch => {
  const id = Date.now()

  dispatch({
    type: SHOW,
    notification: {
      id,
      title,
      content,
      color,
      duration
    }
  })

  if (duration) {
    window.setTimeout(() => {
      dispatch(actions.dismissNotification(id))
    }, duration)
  }
}

actions.dismissNotification = id => {
  return {
    type: DISMISS,
    id
  }
}

const items = (state = [], action) => {
  switch (action.type) {
    case SHOW:
      return state.concat([action.notification])
    case DISMISS:
      return state.filter(({ id }) => id !== action.id)
    default:
      return state
  }
}

export default combineReducers({
  items
})
