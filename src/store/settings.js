import {
  getSettings,
  saveSettings,
  getWidgetSettings,
  saveWidgetSettings,
  getDefaultDays,
  saveDefaultDays
} from 'services/settings'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'
import { actions as notificationActions } from './notification'

const FETCH_SETTING = createRequestTypes('rideto/settings/FETCH')
const UPDATE_SETTING = createRequestTypes('rideto/settings/UPDATE')

const FETCH_DEFAULT_DAYS = createRequestTypes('rideto/defaultDays/FETCH')
const UPDATE_DEFAULT_DAYS = createRequestTypes('rideto/defaultDays/UPDATE')

const FETCH_WIDGET_SETTING = createRequestTypes('rideto/settings/widget/FETCH')
const UPDATE_WIDGET_SETTING = createRequestTypes(
  'rideto/settings/widget/UPDATE'
)

export const fetchDefaultDays = schoolId => async dispatch => {
  dispatch({ type: FETCH_DEFAULT_DAYS[REQUEST] })

  try {
    const defaultDays = await getDefaultDays(schoolId)

    dispatch({
      type: FETCH_DEFAULT_DAYS[SUCCESS],
      data: {
        defaultDays
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_DEFAULT_DAYS[FAILURE], error })
  }
}

export const updateDefaultDays = (data, schoolId) => async dispatch => {
  dispatch({ type: UPDATE_DEFAULT_DAYS[REQUEST] })

  try {
    const defaultDays = await saveDefaultDays(data, schoolId)

    notificationActions.dispatchSuccess(dispatch, 'Settings saved')
    dispatch({
      type: UPDATE_DEFAULT_DAYS[SUCCESS],
      data: {
        defaultDays
      }
    })
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Failed to save settings')
    dispatch({ type: UPDATE_DEFAULT_DAYS[FAILURE], error })
  }
}

export const fetchSettings = () => async dispatch => {
  dispatch({ type: FETCH_SETTING[REQUEST] })

  try {
    const settings = await getSettings()
    dispatch({
      type: FETCH_SETTING[SUCCESS],
      data: {
        settings
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_SETTING[FAILURE], error })
  }
}

export const updateSettings = data => async dispatch => {
  dispatch({ type: UPDATE_SETTING[REQUEST] })

  try {
    const settings = await saveSettings(data)

    notificationActions.dispatchSuccess(dispatch, 'Settings saved')
    dispatch({
      type: UPDATE_SETTING[SUCCESS],
      data: {
        settings
      }
    })
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Failed to save settings')
    dispatch({ type: UPDATE_SETTING[FAILURE], error })
  }
}

export const fetchWidgetSettings = () => async dispatch => {
  dispatch({ type: FETCH_WIDGET_SETTING[REQUEST] })

  try {
    const settings = await getWidgetSettings()
    dispatch({
      type: FETCH_WIDGET_SETTING[SUCCESS],
      data: {
        settings
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_WIDGET_SETTING[FAILURE], error })
  }
}

export const updateWidgetSettings = data => async dispatch => {
  dispatch({ type: UPDATE_WIDGET_SETTING[REQUEST] })

  try {
    const settings = await saveWidgetSettings(data)

    notificationActions.dispatchSuccess(dispatch, 'Settings saved')
    dispatch({
      type: UPDATE_WIDGET_SETTING[SUCCESS],
      data: {
        settings
      }
    })
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Failed to save settings')
    dispatch({ type: UPDATE_WIDGET_SETTING[FAILURE], error })
  }
}

const initialState = {
  settings: null,
  loading: false,
  saving: false,
  error: null,
  widget: {
    settings: null,
    loading: false,
    saving: false,
    error: null
  },
  defaultDays: {
    days: null,
    loading: false,
    saving: false,
    error: null
  }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SETTING[REQUEST]:
      return {
        ...state,
        loading: true,
        error: null
      }
    case FETCH_SETTING[SUCCESS]:
      return {
        ...state,
        loading: false,
        settings: action.data.settings
      }
    case FETCH_SETTING[FAILURE]:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case UPDATE_SETTING[REQUEST]:
      return {
        ...state,
        saving: true,
        error: null
      }
    case UPDATE_SETTING[SUCCESS]:
      return {
        ...state,
        saving: false,
        settings: action.data.settings
      }
    case UPDATE_SETTING[FAILURE]:
      return {
        ...state,
        saving: false,
        error: action.error
      }
    case FETCH_WIDGET_SETTING[REQUEST]:
      return {
        ...state,
        widget: {
          ...state.widget,
          loading: true,
          error: null
        }
      }
    case FETCH_WIDGET_SETTING[SUCCESS]:
      return {
        ...state,
        widget: {
          ...state.widget,
          loading: false,
          settings: action.data.settings
        }
      }
    case FETCH_WIDGET_SETTING[FAILURE]:
      return {
        ...state,
        widget: {
          ...state.widget,
          loading: false,
          error: action.error
        }
      }
    case UPDATE_WIDGET_SETTING[REQUEST]:
      return {
        ...state,
        widget: {
          ...state.widget,
          saving: true,
          error: null
        }
      }
    case UPDATE_WIDGET_SETTING[SUCCESS]:
      return {
        ...state,
        widget: {
          ...state.widget,
          saving: false,
          settings: action.data.settings
        }
      }
    case UPDATE_WIDGET_SETTING[FAILURE]:
      return {
        ...state,
        widget: {
          ...state.widget,
          saving: false,
          error: action.error
        }
      }
    case FETCH_DEFAULT_DAYS[REQUEST]:
      return {
        ...state,
        defaultDays: {
          ...state.defaultDays,
          loading: true,
          error: null
        }
      }
    case FETCH_DEFAULT_DAYS[SUCCESS]:
      return {
        ...state,
        defaultDays: {
          ...state.defaultDays,
          loading: false,
          days: action.data.defaultDays.default_open_days
        }
      }
    case FETCH_DEFAULT_DAYS[FAILURE]:
      return {
        ...state,
        defaultDays: {
          ...state.defaultDays,
          loading: false,
          error: action.error
        }
      }
    case UPDATE_DEFAULT_DAYS[REQUEST]:
      return {
        ...state,
        defaultDays: {
          ...state.defaultDays,
          saving: true,
          error: null
        }
      }
    case UPDATE_DEFAULT_DAYS[SUCCESS]:
      return {
        ...state,
        defaultDays: {
          ...state.defaultDays,
          saving: false,
          days: action.data.defaultDays.default_open_days
        }
      }
    case UPDATE_DEFAULT_DAYS[FAILURE]:
      return {
        ...state,
        defaultDays: {
          ...state.defaultDays,
          saving: false,
          error: action.error
        }
      }
    default:
      return state
  }
}
